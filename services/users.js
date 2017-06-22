const assert = require('assert');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const url = require('url');
const jwt = require('jsonwebtoken');
const Wordlist = require('./wordlist');
const errors = require('../errors');
const {
  JWT_SECRET,
  ROOT_URL
} = require('../config');
const debug = require('debug')('talk:services:users');

const redis = require('./redis');
const redisClient = redis.createClient();

const UserModel = require('../models/user');
const USER_STATUS = require('../models/enum/user_status');
const USER_ROLES = require('../models/enum/user_roles');

const RECAPTCHA_WINDOW_SECONDS = 60 * 10; // 10 minutes.
const RECAPTCHA_INCORRECT_TRIGGER = 5; // after 3 incorrect attempts, recaptcha will be required.

const SettingsService = require('./settings');
const ActionsService = require('./actions');
const MailerService = require('./mailer');

const EMAIL_CONFIRM_JWT_SUBJECT = 'email_confirm';
const PASSWORD_RESET_JWT_SUBJECT = 'password_reset';

// SALT_ROUNDS is the number of rounds that the bcrypt algorithm will run
// through during the salting process.
const SALT_ROUNDS = 10;

// UsersService is the interface for the application to interact with the
// UserModel through.
module.exports = class UsersService {

  /**
   * Returns a user (if found) for the given email address.
   */
  static findLocalUser(email) {
    if (!email || typeof email !== 'string') {
      return Promise.reject('email is required for findLocalUser');
    }

    return UserModel.findOne({
      profiles: {
        $elemMatch: {
          id: email.toLowerCase(),
          provider: 'local'
        }
      }
    });
  }

  /**
   * This records an unsucesfull login attempt for the given email address. If
   * the maximum has been reached, the promise will be rejected with:
   *
   *  errors.ErrLoginAttemptMaximumExceeded
   *
   * Indicating that the account should be flagged as "login recaptcha required"
   * where future login attempts must be made with the recaptcha flag.
   */
  static recordLoginAttempt(email) {
    const rdskey = `la[${email.toLowerCase().trim()}]`;

    return new Promise((resolve, reject) => {
      redisClient
        .multi()
        .incr(rdskey)
        .expire(rdskey, RECAPTCHA_WINDOW_SECONDS)
        .exec((err, replies) => {
          if (err) {
            return reject(err);
          }

          // if this is new or has no expiry
          if (replies[0] === 1 || replies[1] === -1) {

            // then expire it after the timeout
            redisClient.expire(rdskey, RECAPTCHA_WINDOW_SECONDS);
          }

          if (replies[0] >= RECAPTCHA_INCORRECT_TRIGGER) {
            return reject(errors.ErrLoginAttemptMaximumExceeded);
          }

          resolve();
        });
    });
  }

  /**
   * This checks to see if the current login attempts against a user exeeds the
   * maximum value allowed, if so, it rejects with:
   *
   *  errors.ErrLoginAttemptMaximumExceeded
   */
  static checkLoginAttempts(email) {
    const rdskey = `la[${email.toLowerCase().trim()}]`;

    return new Promise((resolve, reject) => {
      redisClient
        .get(rdskey, (err, reply) => {
          if (err) {
            return reject(err);
          }

          if (!reply) {
            return resolve();
          }

          if (reply >= RECAPTCHA_INCORRECT_TRIGGER) {
            return reject(errors.ErrLoginAttemptMaximumExceeded);
          }

          resolve();
        });
    });
  }

  /**
   * Sets or unsets the recaptcha_required flag on a user's local profile.
   */
  static flagForRecaptchaRequirement(email, required) {
    return UserModel.update({
      profiles: {
        $elemMatch: {
          id: email.toLowerCase(),
          provider: 'local'
        }
      }
    }, {
      $set: {
        'profiles.$.metadata.recaptcha_required': required
      }
    });
  }

  /**
   * Merges two users together by taking all the profiles on a given user and
   * pushing them into the source user followed by deleting the destination user's
   * user account. This will
   * not merge the roles associated with the source user.
   * @param  {String} dstUserID id of the user to which is the target of the merge
   * @param  {String} srcUserID id of the user to which is the source of the merge
   * @return {Promise}          resolves when the users are merged
   */
  static mergeUsers(dstUserID, srcUserID) {
    let srcUser, dstUser;

    return Promise
      .all([
        UserModel.findOne({id: dstUserID}).exec(),
        UserModel.findOne({id: srcUserID}).exec()
      ])
      .then((users) => {
        dstUser = users[0];
        srcUser = users[1];

        srcUser.profiles.forEach((profile) => {
          dstUser.profiles.push(profile);
        });

        return srcUser.remove();
      })
      .then(() => dstUser.save());
  }

  static castUsername(username) {
    return username.replace(/ /g, '_').replace(/[^a-zA-Z_]/g, '');
  }

  /**
   * Finds a user given a social profile and if the user does not exist, creates
   * them.
   * @param  {Object}   profile - User social/external profile
   * @param  {Function} done    [description]
   */
  static findOrCreateExternalUser({id, provider, displayName}) {
    return UserModel
      .findOne({
        profiles: {
          $elemMatch: {
            id,
            provider
          }
        }
      })
      .then((user) => {
        if (user) {
          return user;
        }

        // User does not exist and need to be created.

        let username = UsersService.castUsername(displayName);

        // The user was not found, lets create them!
        user = new UserModel({
          username,
          lowercaseUsername: username.toLowerCase(),
          roles: [],
          profiles: [{id, provider}],
          canEditName: true
        });

        return user.save();
      });
  }

  static changePassword(id, password) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, SALT_ROUNDS, (err, hashedPassword) => {
        if (err) {
          return reject(err);
        }

        resolve(hashedPassword);
      });
    })
    .then((hashedPassword) => {
      return UserModel.update({id}, {
        $inc: {__v: 1},
        $set: {
          password: hashedPassword
        }
      });
    });
  }

  /**
   * Creates local users.
   * @param  {Array} users Users to create
   * @return {Promise}     Resolves with the users that were created
   */
  static createLocalUsers(users) {
    return Promise.all(users.map((user) => {
      return UsersService
        .createLocalUser(user.email, user.password, user.username);
    }));
  }

  /**
   * Check the requested username for blocked words and special chars
   * @param  {String}   username              word to be checked for profanity
   * @param  {Boolean}  checkAgainstWordlist  enables cheching against the wordlist
   * @return {Promise}
   */
  static async isValidUsername(username, checkAgainstWordlist = true) {
    const onlyLettersNumbersUnderscore = /^[A-Za-z0-9_]+$/;

    if (!username) {
      throw errors.ErrMissingUsername;
    }

    if (!onlyLettersNumbersUnderscore.test(username)) {
      throw errors.ErrSpecialChars;
    }

    if (checkAgainstWordlist) {

      // check for profanity
      let err = await Wordlist.usernameCheck(username);
      if (err) {
        throw err;
      }
    }

    // No errors found!
    return username;
  }

  /**
   * Performs validations for the password.
   */
  static isValidPassword(password) {
    if (!password) {
      return Promise.reject(errors.ErrMissingPassword);
    }

    if (password.length < 8) {
      return Promise.reject(errors.ErrPasswordTooShort);
    }

    return Promise.resolve(password);
  }

  /**
   * Creates the local user with a given email, password, and name.
   * @param  {String}   email       email of the new user
   * @param  {String}   password    plaintext password of the new user
   * @param  {String}   username name of the display user
   * @param  {Function} done        callback
   */
  static createLocalUser(email, password, username) {

    if (!email) {
      return Promise.reject(errors.ErrMissingEmail);
    }

    email = email.toLowerCase().trim();
    username = username.trim();

    return Promise.all([
      UsersService.isValidUsername(username),
      UsersService.isValidPassword(password)
    ])
      .then(() => { // username is valid
        return new Promise((resolve, reject) => {
          bcrypt.hash(password, SALT_ROUNDS, (err, hashedPassword) => {
            if (err) {
              return reject(err);
            }

            let user = new UserModel({
              username,
              lowercaseUsername: username.toLowerCase(),
              password: hashedPassword,
              roles: [],
              profiles: [
                {
                  id: email,
                  provider: 'local'
                }
              ]
            });

            user.save((err) => {
              if (err) {
                if (err.code === 11000) {
                  if (err.message.match('Username')) {
                    return reject(errors.ErrUsernameTaken);
                  }
                  return reject(errors.ErrEmailTaken);
                }
                return reject(err);
              }
              return resolve(user);
            });
          });
        });
      });
  }

  /**
   * Disables a given user account.
   * @param  {String}   id   id of a user
   * @param  {Function} done callback after the operation is complete
   */
  static disableUser(id) {
    return UserModel.update({
      id: id
    }, {
      $set: {
        disabled: true
      }
    });
  }

  /**
   * Enables a given user account.
   * @param  {String}   id   id of a user
   * @param  {Function} done callback after the operation is complete
   */
  static enableUser(id) {
    return UserModel.update({
      id: id
    }, {
      $set: {
        disabled: false
      }
    });
  }

  /**
   * Adds a role to a user.
   * @param  {String}   id   id of a user
   * @param  {String}   role role to add
   * @param  {Function} done callback after the operation is complete
   */
  static addRoleToUser(id, role) {
    const roles = [];

    // Check to see if the user role is in the allowable set of roles.
    if (role && USER_ROLES.indexOf(role) === -1) {

      // User role is not supported! Error out here.
      return Promise.reject(new Error(`role ${role} is not supported`));
    } else if(role) {
      roles.push(role);
    }

    return UserModel.update({id}, {$set: {roles}});
  }

  /**
   * Removes a role from a user.
   * @param  {String}   id   id of a user
   * @param  {String}   role role to remove
   * @param  {Function} done callback after the operation is complete
   */
  static removeRoleFromUser(id, role) {

    // Check to see if the user role is in the allowable set of roles.
    if (USER_ROLES.indexOf(role) === -1) {

      // User role is not supported! Error out here.
      return Promise.reject(new Error(`role ${role} is not supported`));
    }

    return UserModel.update({
      id: id
    }, {
      $pull: {
        roles: role
      }
    });
  }

  /**
   * Set status of a user.
   * @param  {String}   id   id of a user
   * @param  {String}   status status to set
   * @param  {Function} done callback after the operation is complete
   */
  static setStatus(id, status) {

    // Check to see if the user status is in the allowable set of roles.
    if (USER_STATUS.indexOf(status) === -1) {

      // User status is not supported! Error out here.
      return Promise.reject(new Error(`status ${status} is not supported`));
    }

    return UserModel.update({
      id,
      status: {
        $ne: 'APPROVED'
      }
    }, {
      $set: {
        status
      }
    });
  }

  /**
   * Suspend a user until specified time.
   * @param  {String}   id                  id of a user
   * @param  {String}   message             message to be send to the user
   * @param  {Date}     until               date until the suspension is valid.
   */
  static suspendUser(id, message, until) {
    return UserModel.findOneAndUpdate(
      {id}, {
        $set: {
          suspension: {
            until,
          },
        }
      })
      .then((user) => {
        if (message) {
          let localProfile = user.profiles.find((profile) => profile.provider === 'local');
          if (localProfile) {
            const options =
              {
                template: 'suspension',              // needed to know which template to render!
                locals: {                            // specifies the template locals.
                  body: message
                },
                subject: 'Your account has been suspended',
                to: localProfile.id  // This only works if the user has registered via e-mail.
                                     // We may want a standard way to access a user's e-mail address in the future
              };

            return MailerService.sendSimple(options);
          }
        }
      });
  }

  /**
   * Reject username. It changes the status to BANNED and canEditName to True.
   * @param  {String}   id                  id of a user
   * @param  {String}   message             message to be send to the user
   * @param  {Date}     until               date until the suspension is valid.
   */
  static rejectUsername(id, message) {
    return UserModel.findOneAndUpdate({
      id
    }, {
      $set: {
        status: 'BANNED',
        canEditName: true,
      }
    })
    .then((user) => {
      if (message) {
        let localProfile = user.profiles.find((profile) => profile.provider === 'local');
        if (localProfile) {
          const options =
            {
              template: 'suspension',              // needed to know which template to render!
              locals: {                            // specifies the template locals.
                body: message
              },
              subject: 'Email Suspension',
              to: localProfile.id  // This only works if the user has registered via e-mail.
                                   // We may want a standard way to access a user's e-mail address in the future
            };

          return MailerService.sendSimple(options);
        }
      }
    });
  }

  /**
   * Finds a user with the id.
   * @param {String} id  user id (uuid)
  */
  static findById(id) {
    return UserModel.findOne({id});
  }

  /**
   *
   * @param {String} id  the id of the current user
   * @param {Object} token  a jwt token used to sign in the user
   */
  static async findOrCreateByIDToken(id, token) {

    // Try to get the user.
    let user = await UserModel.findOne({
      id
    });

    // If the user was not found, try to look it up.
    if (user === null) {

      // If the user wasn't found, it will return null and the variable will be
      // unchanged.
      user = await lookupUserNotFound(token);
    }

    return user;
  }

  /**
   * Finds users in an array of ids.
   * @param {Array} ids  array of user identifiers (uuid)
  */
  static findByIdArray(ids) {
    return UserModel.find({
      id: {$in: ids}
    });
  }

  /**
   * Finds public user information by an array of ids.
   * @param {Array} ids  array of user identifiers (uuid)
  */
  static findPublicByIdArray(ids) {
    return UserModel.find({
      id: {$in: ids}
    }, 'id username');
  }

  /**
   * Creates a JWT from a user email. Only works for local accounts.
   * @param {String} email of the local user
   */
  static createPasswordResetToken(email, loc) {
    if (!email || typeof email !== 'string') {
      return Promise.reject('email is required when creating a JWT for resetting passord');
    }

    email = email.toLowerCase();

    return Promise.all([
      UserModel.findOne({profiles: {$elemMatch: {id: email}}}),
      SettingsService.retrieve()
    ])
      .then(([user, settings]) => {
        if (!user) {

          // Since we don't want to reveal that the email does/doesn't exist
          // just go ahead and resolve the Promise with null and check in the
          // endpoint.
          return;
        }
        let redirectDomain;
        try {
          const {hostname, port} = url.parse(loc);
          redirectDomain = hostname;
          if (port) {
            redirectDomain += `:${port}`;
          }
        } catch (e) {
          return Promise.reject('redirect location is invalid');
        }

        if (settings.domains.whitelist.indexOf(redirectDomain) === -1) {
          return Promise.reject('redirect location is not on the list of acceptable domains');
        }

        const payload = {
          jti: uuid.v4(),
          email,
          loc,
          userId: user.id,
          version: user.__v
        };

        return jwt.sign(payload, JWT_SECRET, {
          algorithm: 'HS256',
          expiresIn: '1d',
          subject: PASSWORD_RESET_JWT_SUBJECT
        });
      });
  }

  /**
   * Verifies that the token was indeed signed by the session secret.
   * @param  {String} token JWT token from the client
   * @return {Promise}
   */
  static verifyToken(token, options = {}) {
    return new Promise((resolve, reject) => {

      // Set the allowed algorithms.
      options.algorithms = ['HS256'];

      jwt.verify(token, JWT_SECRET, options, (err, decoded) => {
        if (err) {
          return reject(err);
        }

        resolve(decoded);
      });
    });
  }

  /**
   * Verifies a jwt and returns the associated user.
   * @param {String} token the JSON Web Token to verify
   */
  static verifyPasswordResetToken(token) {
    return UsersService
      .verifyToken(token, {
        subject: PASSWORD_RESET_JWT_SUBJECT
      })

      // TODO: add search by __v as well
      .then((decoded) => {
        return Promise.all([UsersService.findById(decoded.userId), decoded.loc]);
      });
  }

  /**
   * Finds a user using a value which gets compared using a prefix match against
   * the user's email address and/or their username.
   * @param  {String} value value to search by
   * @return {Promise}
   */
  static search(value) {
    return UserModel.find({
      $or: [

        // Search by a prefix match on the username.
        {
          'username': {
            $regex: new RegExp(`^${value}`),
            $options: 'i'
          }
        },

        // Search by a prefix match on the email address.
        {
          'profiles': {
            $elemMatch: {
              id: {
                $regex: new RegExp(`^${value}`),
                $options: 'i'
              },
              provider: 'local'
            }
          }
        }
      ]
    });
  }

  /**
   * Returns a count of the current users.
   * @return {Promise}
   */
  static count() {
    return UserModel.count();
  }

  /**
   * Returns all the users.
   * @return {Promise}
   */
  static all() {
    return UserModel.find();
  }

  /**
   * Updates the user's settings.
   * @return {Promise}
   */
  static updateSettings(id, settings) {
    return UserModel.update({
      id
    }, {
      $set: {
        settings
      }
    });
  }

  /**
   * Add an action to the user.
   * @param {String} item_id  identifier of the user  (uuid)
   * @param {String} user_id  user id of the action (uuid)
   * @param {String} action the new action to the user
   * @return {Promise}
   */
  static addAction(item_id, user_id, action_type, metadata) {
    return ActionsService.insertUserAction({
      item_id,
      item_type: 'users',
      user_id,
      action_type,
      metadata
    });
  }

  /**
   * This creates a token based around confirming the local profile.
   * @param  {String} userID The user id for the user that we are creating the
   *                         token for.
   * @param  {String} email The email that we are needing to get confirmed.
   * @return {Promise}
   */
  static createEmailConfirmToken(userID = null, email, referer = ROOT_URL) {
    if (!email || typeof email !== 'string') {
      return Promise.reject('email is required when creating a JWT for resetting passord');
    }

    // Conform the email to lowercase.
    email = email.toLowerCase();

    const tokenOptions = {
      jwtid: uuid.v4(),
      algorithm: 'HS256',
      expiresIn: '1d',
      subject: EMAIL_CONFIRM_JWT_SUBJECT
    };

    let userPromise;

    if (!userID) {

      // If there is no userID, we're coming from the endpoint where a new user
      // is re-requesting a confirmation email and we don't know the userID.
      userPromise = UserModel.findOne({profiles: {$elemMatch: {id: email, provider: 'local'}}});
    } else {
      userPromise = UsersService.findById(userID);
    }

    return userPromise.then((user) => {
      if (!user) {
        return Promise.reject(errors.ErrNotFound);
      }

      // Get the profile representing the local account.
      let profile = user.profiles.find((profile) => profile.id === email && profile.provider === 'local');

      // Ensure that the user email hasn't already been verified.
      if (profile && profile.metadata && profile.metadata.confirmed_at) {
        return Promise.reject(new Error('email address already confirmed'));
      }

      return jwt.sign({
        email,
        referer,
        userID: user.id
      }, JWT_SECRET, tokenOptions);
    });
  }

  /**
   * This verifies that a given token was for the email confirmation and updates
   * that user's profile with a 'confirmed_at' parameter with the current date.
   * @param  {String} token the token containing the email confirmation details
   *                        signed with our secret.
   * @return {Promise}
   */
  static verifyEmailConfirmation(token) {
    return UsersService
      .verifyToken(token, {
        subject: EMAIL_CONFIRM_JWT_SUBJECT
      })
      .then(({userID, email, referer}) => {
        return UsersService
          .confirmEmail(userID, email)
          .then(() => ({userID, email, referer}));
      });

  }

  /**
   * Marks the email on the user as confirmed.
   */
  static confirmEmail(id, email) {
    return UserModel
      .update({
        id: id,
        profiles: {
          $elemMatch: {
            id: email,
            provider: 'local'
          }
        }
      }, {
        $set: {
          'profiles.$.metadata.confirmed_at': new Date()
        }
      });
  }

  /**
   * Returns all users with pending 'ADMIN'ation actions.
   * @return {Promise}
   */
  static moderationQueue() {
    return UserModel.find({status: 'PENDING'});
  }

  /**
   * Gives the user the ability to edit their username.
   * @param  {String} id the id of the user to be toggled.
   * @param  {Boolean} canEditName sets whether the user can edit their name.
   * @return {Promise}
   */
  static toggleNameEdit(id, canEditName) {
    return UserModel.update({id}, {
      $set: {canEditName}
    });
  }

  /**
   * Updates the user's username.
   * @param  {String} id       The id of the user.
   * @param  {String} username The new username for the user.
   * @return {Promise}
   */
  static async editName(id, username) {
    try {
      const result = await UserModel.findOneAndUpdate({
        id,
        username: {$ne: username},
        canEditName: true
      }, {
        $set: {
          username: username,
          lowercaseUsername: username.toLowerCase(),
          canEditName: false,
          status: 'PENDING',
        }
      }, {
        new: true,
      });

      if (!result) {
        const user = await UsersService.findById(id);
        if (user === null) {
          throw errors.ErrNotFound;
        }

        if (!user.canEditName) {
          throw errors.ErrPermissionUpdateUsername;
        }

        if (user.username === username) {
          throw errors.ErrSameUsernameProvided;
        }

        throw new Error('edit username failed for an unexpected reason');
      }

      return result;
    }
    catch(err) {
      if (err.code === 11000) {
        throw errors.ErrUsernameTaken;
      }
      throw err;
    }
  }

  /**
   * Ignore another user
   * @param  {String} userId the id of the user that is ignoring another users
   * @param  {String[]} usersToIgnore Array of user IDs to ignore
   */
  static ignoreUsers(userId, usersToIgnore) {
    assert(Array.isArray(usersToIgnore), 'usersToIgnore is an array');
    assert(usersToIgnore.every((u) => typeof u === 'string'), 'usersToIgnore is an array of string user IDs');
    if (usersToIgnore.includes(userId)) {
      throw new Error('Users cannot ignore themselves');
    }

    // TODO: For each usersToIgnore, make sure they exist?
    return UserModel.update({id: userId}, {
      $addToSet:  {
        ignoresUsers: {
          $each: usersToIgnore
        }
      }
    });
  }

  /**
   * Stop ignoring other users
   * @param  {String} userId the id of the user that is ignoring another users
   * @param  {String[]} usersToStopIgnoring Array of user IDs to stop ignoring
   */
  static async stopIgnoringUsers(userId, usersToStopIgnoring) {
    assert(Array.isArray(usersToStopIgnoring), 'usersToStopIgnoring is an array');
    assert(usersToStopIgnoring.every((u) => typeof u === 'string'), 'usersToStopIgnoring is an array of string user IDs');
    await UserModel.update({id: userId}, {
      $pullAll:  {
        ignoresUsers: usersToStopIgnoring
      }
    });
  }
};

// Extract all the tokenUserNotFound plugins so we can integrate with other
// providers.
let tokenUserNotFoundHooks = null;

// Provide a function that can loop over the hooks and search for a provider
// can crack the token to a user.
const lookupUserNotFound = async (token) => {
  if (!Array.isArray(tokenUserNotFoundHooks)) {
    tokenUserNotFoundHooks = require('./plugins')
      .get('server', 'tokenUserNotFound')
      .map(({plugin, tokenUserNotFound}) => {
        debug(`added plugin '${plugin.name}' to tokenUserNotFound hooks`);

        return tokenUserNotFound;
      });
  }

  for (let hook of tokenUserNotFoundHooks) {
    let user = await hook(token);
    if (user !== null && typeof user !== 'undefined') {
      return user;
    }
  }

  return null;
};
