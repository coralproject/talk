const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Wordlist = require('./wordlist');
const errors = require('../errors');
const uuid = require('uuid');

const UserModel = require('../models/user');
const USER_STATUS = require('../models/user').USER_STATUS;
const USER_ROLES = require('../models/user').USER_ROLES;

const ActionsService = require('./actions');

// In the event that the TALK_SESSION_SECRET is missing but we are testing, then
// set the process.env.TALK_SESSION_SECRET.
if (process.env.NODE_ENV === 'test' && !process.env.TALK_SESSION_SECRET) {
  process.env.TALK_SESSION_SECRET = 'keyboard cat';
} else if (!process.env.TALK_SESSION_SECRET) {
  throw new Error('TALK_SESSION_SECRET must be defined to encode JSON Web Tokens and other auth functionality');
}

const EMAIL_CONFIRM_JWT_SUBJECT = 'email_confirm';
const PASSWORD_RESET_JWT_SUBJECT = 'password_reset';

// SALT_ROUNDS is the number of rounds that the bcrypt algorithm will run
// through during the salting process.
const SALT_ROUNDS = 10;

// UsersService is the interface for the application to interact with the
// UserModel through.
module.exports = class UsersService {

  /**
   * Finds a user given their email address that we have for them in the system
   * and ensures that the retuned user matches the password passed in as well.
   * @param  {string}   email     - email to look up the user by
   * @param  {string}   password  - password to match against the found user
   * @param  {Function} done     [description]
   */
  static findLocalUser(email, password) {
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
    })
    .then((user) => {
      if (!user) {
        return false;
      }

      return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, res) => {
          if (err) {
            return reject(err);
          }

          if (!res) {
            return resolve(false);
          }

          return resolve(user);
        });
      });
    });
  }

  /**
   * Merges two users together by taking all the profiles on a given user and
   * pushing them into the source user followed by deleting the destination user's
   * user account. This will not merge the roles associated with the source user.
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

  /**
   * Finds a user given a social profile and if the user does not exist, creates
   * them.
   * @param  {Object}   profile - User social/external profile
   * @param  {Function} done    [description]
   */
  static findOrCreateExternalUser(profile) {
    return UserModel
      .findOne({
        profiles: {
          $elemMatch: {
            id: profile.id,
            provider: profile.provider
          }
        }
      })
      .then((user) => {
        if (user) {
          return user;
        }

        // The user was not found, lets create them!
        user = new UserModel({
          displayName: profile.displayName,
          roles: [],
          profiles: [
            {
              id: profile.id,
              provider: profile.provider
            }
          ]
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
        .createLocalUser(user.email, user.password, user.displayName);
    }));
  }

  /**
   * Check the requested displayname for naughty words (currently in English) and special chars
   * @param  {String}   displayName           word to be checked for profanity
   * @param  {Boolean}  checkAgainstWordlist  enables cheching against the wordlist
   * @return {Promise}  rejected if the machine's sensibilites are offended
   */
  static isValidDisplayName(displayName, checkAgainstWordlist = true) {
    const onlyLettersNumbersUnderscore = /^[A-Za-z0-9_]+$/;

    if (!displayName) {
      return Promise.reject(errors.ErrMissingDisplay);
    }

    if (!onlyLettersNumbersUnderscore.test(displayName)) {

      return Promise.reject(errors.ErrSpecialChars);
    }

    if (checkAgainstWordlist) {

      // check for profanity
      return Wordlist.displayNameCheck(displayName);
    }

    // No errors found!
    return Promise.resolve(displayName);
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
   * @param  {String}   displayName name of the display user
   * @param  {Function} done        callback
   */
  static createLocalUser(email, password, displayName) {

    if (!email) {
      return Promise.reject(errors.ErrMissingEmail);
    }

    email = email.toLowerCase().trim();
    displayName = displayName.toLowerCase().trim();

    return Promise.all([
      UsersService.isValidDisplayName(displayName),
      UsersService.isValidPassword(password)
    ])
      .then(() => { // displayName is valid
        return new Promise((resolve, reject) => {
          bcrypt.hash(password, SALT_ROUNDS, (err, hashedPassword) => {
            if (err) {
              return reject(err);
            }

            let user = new UserModel({
              displayName: displayName,
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
                  if (err.message.match('displayName')) {
                    return reject(errors.ErrDisplayTaken);
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

    // Check to see if the user role is in the allowable set of roles.
    if (USER_ROLES.indexOf(role) === -1) {

      // User role is not supported! Error out here.
      return Promise.reject(new Error(`role ${role} is not supported`));
    }

    return UserModel.update({
      id: id
    }, {
      $addToSet: {
        roles: role
      }
    });
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
   * Finds a user with the id.
   * @param {String} id  user id (uuid)
  */
  static findById(id) {
    return UserModel.findOne({id});
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
    }, 'id displayName');
  }

  /**
   * Creates a JWT from a user email. Only works for local accounts.
   * @param {String} email of the local user
   */
  static createPasswordResetToken(email) {
    if (!email || typeof email !== 'string') {
      return Promise.reject('email is required when creating a JWT for resetting passord');
    }

    email = email.toLowerCase();

    return UserModel.findOne({profiles: {$elemMatch: {id: email}}})
      .then((user) => {
        if (!user) {

          // Since we don't want to reveal that the email does/doesn't exist
          // just go ahead and resolve the Promise with null and check in the
          // endpoint.
          return;
        }

        const payload = {
          jti: uuid.v4(),
          email,
          userId: user.id,
          version: user.__v
        };

        return jwt.sign(payload, process.env.TALK_SESSION_SECRET, {
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

      jwt.verify(token, process.env.TALK_SESSION_SECRET, options, (err, decoded) => {
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
      .then((decoded) => UsersService.findById(decoded.userId));
  }

  /**
   * Finds a user using a value which gets compared using a prefix match against
   * the user's email address and/or their display name.
   * @param  {String} value value to search by
   * @return {Promise}
   */
  static search(value) {
    return UserModel.find({
      $or: [

        // Search by a prefix match on the displayName.
        {
          'displayName': {
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
  static createEmailConfirmToken(userID = null, email, referer = process.env.TALK_ROOT_URL) {
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
      }, process.env.TALK_SESSION_SECRET, tokenOptions);
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
   * Updates the user's displayName.
   * @param  {String} id the id of the user to be enabled.
   * @param  {String}  displayName The new displayname for the user.
   * @return {Promise}
   */
  static editName(id, displayName) {
    return UserModel.update({
      id,
      canEditName: true
    }, {
      $set: {
        displayName: displayName.toLowerCase(),
        canEditName: false,
        status: 'PENDING'
      }
    }).then((result) => {
      return result.nModified > 0 ? result :
      Promise.reject(new Error('You do not have permission to update your username.'));
    });
  }

  /**
   * Returns true if the user is staff.
   * @param  {String} id the id of the user to be enabled.
   * @return {Promise}
   */
  static isStaff(id) {
    return UsersService.findById(id).then((user) => {
      if (user) {
        return user.hasRoles('ADMIN');
      }
      return false;
    });
  }
};
