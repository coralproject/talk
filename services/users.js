const assert = require('assert');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const errors = require('../errors');

const {
  ROOT_URL
} = require('../config');

const {
  jwt: JWT_SECRET
} = require('../secrets');

const debug = require('debug')('talk:services:users');

const UserModel = require('../models/user');
const USER_STATUS = require('../models/enum/user_status');
const USER_ROLES = require('../models/enum/user_roles');

const RECAPTCHA_WINDOW_SECONDS = 60 * 10; // 10 minutes.
const RECAPTCHA_INCORRECT_TRIGGER = 5; // after 3 incorrect attempts, recaptcha will be required.

const ActionsService = require('./actions');
const MailerService = require('./mailer');
const Wordlist = require('./wordlist');
const Domainlist = require('./domainlist');

const EMAIL_CONFIRM_JWT_SUBJECT = 'email_confirm';
const PASSWORD_RESET_JWT_SUBJECT = 'password_reset';

// SALT_ROUNDS is the number of rounds that the bcrypt algorithm will run
// through during the salting process.
const SALT_ROUNDS = 10;

// Create a redis client to use for authentication.
const {createClientFactory} = require('./redis');

const client = createClientFactory();

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
  static async recordLoginAttempt(email) {
    const rdskey = `la[${email.toLowerCase().trim()}]`;

    const replies = await client()
      .multi()
      .incr(rdskey)
      .expire(rdskey, RECAPTCHA_WINDOW_SECONDS)
      .exec();

    // if this is new or has no expiry
    if (replies[0] === 1 || replies[1] === -1) {

      // then expire it after the timeout
      client().expire(rdskey, RECAPTCHA_WINDOW_SECONDS);
    }

    if (replies[0] >= RECAPTCHA_INCORRECT_TRIGGER) {
      throw errors.ErrLoginAttemptMaximumExceeded;
    }
  }

  /**
   * This checks to see if the current login attempts against a user exeeds the
   * maximum value allowed, if so, it rejects with:
   *
   *  errors.ErrLoginAttemptMaximumExceeded
   */
  static async checkLoginAttempts(email) {
    const rdskey = `la[${email.toLowerCase().trim()}]`;

    const attempts = await client().get(rdskey);
    if (!attempts) {
      return;
    }

    if (attempts >= RECAPTCHA_INCORRECT_TRIGGER) {
      throw errors.ErrLoginAttemptMaximumExceeded;
    }
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

  static async changePassword(id, password) {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    return UserModel.update({id}, {
      $inc: {__v: 1},
      $set: {
        password: hashedPassword
      }
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
  static async createLocalUser(email, password, username) {

    if (!email) {
      throw errors.ErrMissingEmail;
    }

    email = email.toLowerCase().trim();
    username = username.trim();

    await Promise.all([
      UsersService.isValidUsername(username),
      UsersService.isValidPassword(password)
    ]);

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

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

    try {
      user = await user.save();
    } catch (err) {
      if (err.code === 11000) {
        if (err.message.match('Username')) {
          throw errors.ErrUsernameTaken;
        }
        throw errors.ErrEmailTaken;
      }
      throw err;
    }

    return user;
  }

  /**
   * Disables a given user account.
   * @param  {String}   id   id of a user
   * @param  {Function} done callback after the operation is complete
   */
  static disableUser(id) {
    return UserModel.update({
      id
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
      id
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
  static async addRoleToUser(id, role) {
    const roles = [];

    // Check to see if the user role is in the allowable set of roles.
    if (role && USER_ROLES.indexOf(role) === -1) {

      // User role is not supported! Error out here.
      throw new Error(`role ${role} is not supported`);
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
  static async removeRoleFromUser(id, role) {

    // Check to see if the user role is in the allowable set of roles.
    if (USER_ROLES.indexOf(role) === -1) {

      // User role is not supported! Error out here.
      throw new Error(`role ${role} is not supported`);
    }

    return UserModel.update({id}, {
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
  static async setStatus(id, status) {

    // Check to see if the user status is in the allowable set of roles.
    if (USER_STATUS.indexOf(status) === -1) {

      // User status is not supported! Error out here.
      throw new Error(`status ${status} is not supported`);
    }

    // TODO: current updating status behavior is weird.
    // once a user has been `APPROVED` its status cannot be
    // changed anymore.
    return UserModel.findOneAndUpdate({
      id,
      status: {
        $ne: 'APPROVED'
      }
    }, {
      $set: {
        status
      }
    }, {
      new: true,
    });
  }

  /**
   * Suspend a user until specified time.
   * @param  {String}   id                  id of a user
   * @param  {String}   message             message to be send to the user
   * @param  {Date}     until               date until the suspension is valid.
   */
  static async suspendUser(id, message, until) {
    const user = await UserModel.findOneAndUpdate({id}, {
      $set: {
        suspension: {
          until,
        },
      }
    }, {
      new: true,
    });

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

        await MailerService.sendSimple(options);
      }
    }

    return user;
  }

  /**
   * Reject username. It changes the status to BANNED and canEditName to True.
   * @param  {String}   id                  id of a user
   * @param  {String}   message             message to be send to the user
   * @param  {Date}     until               date until the suspension is valid.
   */
  static async rejectUsername(id, message) {
    const user = await UserModel.findOneAndUpdate({id}, {
      $set: {
        status: 'BANNED',
        canEditName: true,
      }
    }, {
      new: true,
    });

    if (message) {
      let localProfile = user.profiles.find(({provider}) => provider === 'local');
      if (localProfile) {
        const options = {
          template: 'suspension',              // needed to know which template to render!
          locals: {                            // specifies the template locals.
            body: message
          },
          subject: 'Email Suspension',
          to: localProfile.id  // This only works if the user has registered via e-mail.
          // We may want a standard way to access a user's e-mail address in the future
        };

        await MailerService.sendSimple(options);
      }
    }

    return user;
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
    let user = await UserModel.findOne({id});

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
  static async createPasswordResetToken(email, loc) {
    if (!email || typeof email !== 'string') {
      throw new Error('email is required when creating a JWT for resetting passord');
    }

    email = email.toLowerCase();

    const [user, domainValidated] = await Promise.all([
      UserModel.findOne({profiles: {$elemMatch: {id: email}}}),
      Domainlist.urlCheck(loc),
    ]);
    if (!user) {

      // Since we don't want to reveal that the email does/doesn't exist
      // just go ahead and resolve the Promise with null and check in the
      // endpoint.
      return;
    }

    // If the domain didn't match any of the whitelisted domains and if it
    // didn't match the mount domain, then throw an error.
    if (!domainValidated && !Domainlist.matchMount(loc)) {
      throw new Error('user supplied location exists on non-permitted domain');
    }

    const payload = {
      jti: uuid.v4(),
      email,
      loc,
      userId: user.id,
      version: user.__v
    };

    return JWT_SECRET.sign(payload, {
      expiresIn: '1d',
      subject: PASSWORD_RESET_JWT_SUBJECT
    });
  }

  /**
   * Verifies that the token was indeed signed by the session secret.
   * @param  {String} token JWT token from the client
   * @return {Promise}
   */
  static verifyToken(token, options = {}) {
    return new Promise((resolve, reject) => {
      JWT_SECRET.verify(token, options, (err, decoded) => {
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
  static async verifyPasswordResetToken(token) {
    const {userId, loc, version} = await UsersService.verifyToken(token, {
      subject: PASSWORD_RESET_JWT_SUBJECT
    });

    const user = await UsersService.findById(userId);

    if (version !== user.__v) {
      throw new Error('password reset token has expired');
    }

    return [user, loc];
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
    return ActionsService.create({
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
  static async createEmailConfirmToken(userID = null, email, referer = ROOT_URL) {
    if (!email || typeof email !== 'string') {
      throw new Error('email is required when creating a JWT for resetting passord');
    }

    // Conform the email to lowercase.
    email = email.toLowerCase();

    const tokenOptions = {
      jwtid: uuid.v4(),
      expiresIn: '1d',
      subject: EMAIL_CONFIRM_JWT_SUBJECT
    };

    let user;
    if (!userID) {

      // If there is no userID, we're coming from the endpoint where a new user
      // is re-requesting a confirmation email and we don't know the userID.
      user = await UserModel.findOne({profiles: {$elemMatch: {id: email, provider: 'local'}}});
    } else {
      user = await UsersService.findById(userID);
    }

    if (!user) {
      throw errors.ErrNotFound;
    }

    // Get the profile representing the local account.
    let profile = user.profiles.find((profile) => profile.id === email && profile.provider === 'local');

    // Ensure that the user email hasn't already been verified.
    if (profile && profile.metadata && profile.metadata.confirmed_at) {
      throw new Error('email address already confirmed');
    }

    return JWT_SECRET.sign({
      email,
      referer,
      userID: user.id
    }, tokenOptions);
  }

  /**
   * This verifies that a given token was for the email confirmation and updates
   * that user's profile with a 'confirmed_at' parameter with the current date.
   * @param  {String} token the token containing the email confirmation details
   *                        signed with our secret.
   * @return {Promise}
   */
  static async verifyEmailConfirmation(token) {
    let {userID, email, referer} = await UsersService.verifyToken(token, {
      subject: EMAIL_CONFIRM_JWT_SUBJECT
    });

    await UsersService.confirmEmail(userID, email);

    return {userID, email, referer};
  }

  /**
   * Marks the email on the user as confirmed.
   */
  static confirmEmail(id, email) {
    return UserModel
      .update({
        id,
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

    // TODO: Revisit this when we revamped User status workflows.
    const queryUsernameRejected = {
      id,
      username: {$ne: username},
      status: 'BANNED',
      canEditName: true
    };

    const queryCreateUsername = {
      id,
      status: 'ACTIVE',
      canEditName: true
    };

    try {
      const result = await UserModel.findOneAndUpdate({
        $or: [queryUsernameRejected, queryCreateUsername],
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
   * @param  {String} id the id of the user that is ignoring another users
   * @param  {Array<String>} usersToIgnore Array of user IDs to ignore
   */
  static ignoreUsers(id, usersToIgnore) {
    assert(Array.isArray(usersToIgnore), 'usersToIgnore is an array');
    assert(usersToIgnore.every((u) => typeof u === 'string'), 'usersToIgnore is an array of string user IDs');
    if (usersToIgnore.includes(id)) {
      throw new Error('Users cannot ignore themselves');
    }

    // TODO: For each usersToIgnore, make sure they exist?
    return UserModel.update({id}, {
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
   * @param  {Array<String>} usersToStopIgnoring Array of user IDs to stop ignoring
   */
  static async stopIgnoringUsers(id, usersToStopIgnoring) {
    assert(Array.isArray(usersToStopIgnoring), 'usersToStopIgnoring is an array');
    assert(usersToStopIgnoring.every((u) => typeof u === 'string'), 'usersToStopIgnoring is an array of string user IDs');
    await UserModel.update({id}, {
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
