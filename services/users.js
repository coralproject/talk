const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const errors = require('../errors');
const some = require('lodash/some');
const merge = require('lodash/merge');

const {
  USERS_NEW,
  USERS_SUSPENSION_CHANGE,
  USERS_BAN_CHANGE,
  USERS_USERNAME_STATUS_CHANGE,
} = require('./events/constants');
const events = require('./events');

const { ROOT_URL } = require('../config');

const { jwt: JWT_SECRET } = require('../secrets');

const debug = require('debug')('talk:services:users');

const UserModel = require('../models/user');

const RECAPTCHA_WINDOW = '10m'; // 10 minutes.
const RECAPTCHA_INCORRECT_TRIGGER = 5; // after 3 incorrect attempts, recaptcha will be required.

const ActionsService = require('./actions');
const mailer = require('./mailer');
const i18n = require('./i18n');
const Wordlist = require('./wordlist');
const DomainList = require('./domain_list');

const EMAIL_CONFIRM_JWT_SUBJECT = 'email_confirm';
const PASSWORD_RESET_JWT_SUBJECT = 'password_reset';

// SALT_ROUNDS is the number of rounds that the bcrypt algorithm will run
// through during the salting process.
const SALT_ROUNDS = 10;

// Create a redis client to use for authentication.
const Limit = require('./limit');
const loginRateLimiter = new Limit(
  'loginAttempts',
  RECAPTCHA_INCORRECT_TRIGGER,
  RECAPTCHA_WINDOW
);

// UsersService is the interface for the application to interact with the
// UserModel through.
class UsersService {
  /**
   * Returns a user (if found) for the given email address.
   */
  static findLocalUser(email) {
    return UserModel.findOne({
      profiles: {
        $elemMatch: {
          id: email.toLowerCase(),
          provider: 'local',
        },
      },
    });
  }

  /**
   * This records an unsuccessful login attempt for the given email address. If
   * the maximum has been reached, the promise will be rejected with:
   *
   *  errors.ErrLoginAttemptMaximumExceeded
   *
   * Indicating that the account should be flagged as "login recaptcha required"
   * where future login attempts must be made with the recaptcha flag.
   */
  static async recordLoginAttempt(email) {
    try {
      await loginRateLimiter.test(email.toLowerCase().trim());
    } catch (err) {
      if (err === errors.ErrMaxRateLimit) {
        throw errors.ErrLoginAttemptMaximumExceeded;
      }

      throw err;
    }
  }

  static async setSuspensionStatus(id, until, assignedBy = null, message) {
    let user = await UserModel.findOneAndUpdate(
      { id },
      {
        $set: {
          'status.suspension.until': until,
        },
        $push: {
          'status.suspension.history': {
            until,
            assigned_by: assignedBy,
            message,
            created_at: Date.now(),
          },
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (user === null) {
      user = await UserModel.findOne({ id });
      if (user === null) {
        throw errors.ErrNotFound;
      }

      // Date comparisons are difficult when using MongoDB. Javascript will
      // store the date at a higher precision than Mongo can store, hence we
      // check if the date is within 1 second of the time we're trying to set.
      if (
        user.status.suspension.until === until ||
        (user.status.suspension.until.getTime() > until.getTime() - 1000 &&
          user.status.suspension.until.getTime() < until.getTime() + 1000)
      ) {
        return user;
      }

      throw new Error(
        'suspension status change edit failed for an unknown reason'
      );
    }

    // Emit that the user username status was changed.
    await events.emitAsync(USERS_SUSPENSION_CHANGE, user, {
      until,
      message,
      assignedBy,
    });

    return user;
  }

  static async setBanStatus(id, status, assignedBy = null, message) {
    let user = await UserModel.findOneAndUpdate(
      {
        id,
        'status.banned.status': {
          $ne: status,
        },
      },
      {
        $set: {
          'status.banned.status': status,
        },
        $push: {
          'status.banned.history': {
            status,
            assigned_by: assignedBy,
            message,
            created_at: Date.now(),
          },
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (user === null) {
      user = await UserModel.findOne({ id });
      if (user === null) {
        throw errors.ErrNotFound;
      }

      if (user.status.banned.status === status) {
        return user;
      }

      throw new Error('ban status change edit failed for an unknown reason');
    }

    // Emit that the user ban status was changed.
    await events.emitAsync(USERS_BAN_CHANGE, user, {
      status,
      assignedBy,
      message,
    });

    return user;
  }

  static async setUsernameStatus(id, status, assignedBy = null) {
    let user = await UserModel.findOneAndUpdate(
      {
        id,
        'status.username.status': {
          $ne: status,
        },
      },
      {
        $set: {
          'status.username.status': status,
        },
        $push: {
          'status.username.history': {
            status,
            assigned_by: assignedBy,
            created_at: Date.now(),
          },
        },
      },
      {
        new: true,
      }
    );
    if (user === null) {
      user = await UserModel.findOne({ id });
      if (user === null) {
        throw errors.ErrNotFound;
      }

      if (user.status.username.status === status) {
        return user;
      }

      throw new Error(
        'username status change edit failed for an unknown reason'
      );
    }

    // Emit that the user username status was changed.
    await events.emitAsync(USERS_USERNAME_STATUS_CHANGE, user, {
      status,
      assignedBy,
    });

    return user;
  }

  static async _setUsername(
    id,
    username,
    fromStatus,
    toStatus,
    assignedBy,
    resetAllowed = false
  ) {
    try {
      const query = {
        id,
        'status.username.status': fromStatus,
      };
      if (!resetAllowed) {
        query.username = { $ne: username };
      }

      let user = await UserModel.findOneAndUpdate(
        query,
        {
          $set: {
            username,
            lowercaseUsername: username.toLowerCase(),
            'status.username.status': toStatus,
          },
          $push: {
            'status.username.history': {
              status: toStatus,
              assigned_by: assignedBy,
              created_at: Date.now(),
            },
          },
        },
        {
          new: true,
        }
      );
      if (!user) {
        user = await UsersService.findById(id);
        if (user === null) {
          throw errors.ErrNotFound;
        }

        if (user.status.username.status !== fromStatus) {
          throw errors.ErrPermissionUpdateUsername;
        }

        if (!resetAllowed && user.username === username) {
          throw errors.ErrSameUsernameProvided;
        }

        throw new Error('edit username failed for an unexpected reason');
      }

      // Emit that the user username status was changed.
      await events.emitAsync(USERS_USERNAME_STATUS_CHANGE, user, toStatus);

      return user;
    } catch (err) {
      if (err.code === 11000) {
        throw errors.ErrUsernameTaken;
      }

      throw err;
    }
  }

  static async setUsername(id, username, assignedBy) {
    return UsersService._setUsername(
      id,
      username,
      'UNSET',
      'SET',
      assignedBy,
      true
    );
  }

  static async changeUsername(id, username, assignedBy) {
    return UsersService._setUsername(
      id,
      username,
      'REJECTED',
      'CHANGED',
      assignedBy
    );
  }

  /**
   * This checks to see if the current login attempts against a user exceeds the
   * maximum value allowed, if so, it rejects with:
   *
   *  errors.ErrLoginAttemptMaximumExceeded
   */
  static async checkLoginAttempts(email) {
    const attempts = await loginRateLimiter.get(email.toLowerCase().trim());
    if (!attempts) {
      return;
    }

    if (attempts >= RECAPTCHA_INCORRECT_TRIGGER) {
      throw errors.ErrLoginAttemptMaximumExceeded;
    }
  }

  /**
   * Sets or removes the recaptcha_required flag on a user's local profile.
   */
  static flagForRecaptchaRequirement(email, required) {
    return UserModel.update(
      {
        profiles: {
          $elemMatch: {
            id: email.toLowerCase(),
            provider: 'local',
          },
        },
      },
      {
        $set: {
          'profiles.$.metadata.recaptcha_required': required,
        },
      }
    );
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
  static async findOrCreateExternalUser({ id, provider, displayName }) {
    let user = await UserModel.findOne({
      profiles: {
        $elemMatch: {
          id,
          provider,
        },
      },
    });
    if (user) {
      return user;
    }

    // User does not exist and need to be created.

    // Create an initial username for the user.
    let username = UsersService.castUsername(displayName);

    // The user was not found, lets create them!
    user = new UserModel({
      username,
      lowercaseUsername: username.toLowerCase(),
      profiles: [{ id, provider }],
      status: {
        username: {
          status: 'UNSET',
          history: {
            status: 'UNSET',
          },
        },
      },
    });

    // Save the user in the database.
    await user.save();

    // Emit that the user was created.
    await events.emitAsync(USERS_NEW, user);

    return user;
  }

  /**
   * sendEmailConfirmation sends a confirmation email to the user.
   * @param {String}     user  the user to send the email to
   * @param {String}     email   the email for the user to send the email to
   */
  static async sendEmailConfirmation(user, email, redirectURI = ROOT_URL) {
    let token = await UsersService.createEmailConfirmToken(
      user,
      email,
      redirectURI
    );

    return mailer.send({
      template: 'email-confirm',
      locals: {
        token,
        rootURL: ROOT_URL,
        email,
      },
      subject: i18n.t('email.confirm.subject'),
      to: email,
    });
  }

  static async sendEmail(user, options) {
    const email = user.firstEmail;
    if (!email) {
      // Rather than throwing an error here, we'll
      console.warn(new Error('user does not have an email'));
      return;
    }

    return mailer.send(
      merge({}, options, {
        to: email,
      })
    );
  }

  static async changePassword(id, password) {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    return UserModel.update(
      { id },
      {
        $inc: { __v: 1 },
        $set: {
          password: hashedPassword,
        },
      }
    );
  }

  /**
   * Creates local users.
   * @param  {Array} users Users to create
   * @return {Promise}     Resolves with the users that were created
   */
  static createLocalUsers(users) {
    return Promise.all(
      users.map(user => {
        return UsersService.createLocalUser(
          user.email,
          user.password,
          user.username
        );
      })
    );
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
      UsersService.isValidPassword(password),
    ]);

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    let user = new UserModel({
      username,
      lowercaseUsername: username.toLowerCase(),
      password: hashedPassword,
      profiles: [
        {
          id: email,
          provider: 'local',
        },
      ],
      status: {
        username: {
          status: 'SET',
          history: {
            status: 'SET',
          },
        },
      },
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

    // Emit that the user was created.
    await events.emitAsync(USERS_NEW, user);

    return user;
  }

  /**
   * Sets a given user's role to the one provided.
   * @param  {String}   id   id of a user
   * @param  {String}   role role to add
   */
  static setRole(id, role) {
    return UserModel.update(
      { id },
      { $set: { role } },
      { runValidators: true }
    );
  }

  /**
   * Finds a user with the id.
   * @param {String} id  user id (uuid)
   */
  static findById(id) {
    return UserModel.findOne({ id });
  }

  /**
   *
   * @param {String} id  the id of the current user
   * @param {Object} token  a jwt token used to sign in the user
   */
  static async findOrCreateByIDToken(id, token) {
    // Try to get the user.
    let user = await UserModel.findOne({ id });

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
      id: { $in: ids },
    });
  }

  /**
   * Finds public user information by an array of ids.
   * @param {Array} ids  array of user identifiers (uuid)
   */
  static findPublicByIdArray(ids) {
    return UserModel.find(
      {
        id: { $in: ids },
      },
      'id username'
    );
  }

  /**
   * Creates a JWT from a user email. Only works for local accounts.
   * @param {String} email of the local user
   */
  static async createPasswordResetToken(email, loc) {
    if (!email || typeof email !== 'string') {
      throw new Error(
        'email is required when creating a JWT for resetting passord'
      );
    }

    email = email.toLowerCase();

    const [user, domainValidated] = await Promise.all([
      UserModel.findOne({ profiles: { $elemMatch: { id: email } } }),
      DomainList.urlCheck(loc),
    ]);
    if (!user) {
      // Since we don't want to reveal that the email does/doesn't exist
      // just go ahead and resolve the Promise with null and check in the
      // endpoint.
      return;
    }

    // If the domain didn't match any of the whitelisted domains and if it
    // didn't match the mount domain, then throw an error.
    if (!domainValidated && !DomainList.matchMount(loc)) {
      throw new Error('user supplied location exists on non-permitted domain');
    }

    const payload = {
      jti: uuid.v4(),
      email,
      loc,
      userId: user.id,
      version: user.__v,
    };

    return JWT_SECRET.sign(payload, {
      expiresIn: '1d',
      subject: PASSWORD_RESET_JWT_SUBJECT,
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
   * Verifies a jwt and returns the associated user. Throws an error when the
   * token isn't valid.
   *
   * @param {String} token the JSON Web Token to verify
   */
  static async verifyPasswordResetToken(token) {
    if (!token) {
      throw new Error('cannot verify an empty token');
    }

    const { userId, loc, version } = await UsersService.verifyToken(token, {
      subject: PASSWORD_RESET_JWT_SUBJECT,
    });

    const user = await UsersService.findById(userId);

    if (version !== user.__v) {
      throw new Error('password reset token has expired');
    }

    return [user, loc];
  }

  /**
   * Returns a count of the current users.
   * @return {Promise}
   */
  static count(query = {}) {
    return UserModel.count(query);
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
    return UserModel.update(
      {
        id,
      },
      {
        $set: {
          settings,
        },
      }
    );
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
      metadata,
    });
  }

  /**
   * This creates a token based around confirming the local profile.
   * @param  {String} userID The user id for the user that we are creating the
   *                         token for.
   * @param  {String} email The email that we are needing to get confirmed.
   * @return {Promise}
   */
  static async createEmailConfirmToken(user, email, referer = ROOT_URL) {
    if (!email || typeof email !== 'string') {
      throw new Error(
        'email is required when creating a JWT for resetting password'
      );
    }

    // Conform the email to lowercase.
    email = email.toLowerCase();

    const tokenOptions = {
      jwtid: uuid.v4(),
      expiresIn: '1d',
      subject: EMAIL_CONFIRM_JWT_SUBJECT,
    };

    // Get the profile representing the local account.
    let profile = user.profiles.find(
      profile => profile.id === email && profile.provider === 'local'
    );

    // Ensure that the user email hasn't already been verified.
    if (profile && profile.metadata && profile.metadata.confirmed_at) {
      throw new Error('email address already confirmed');
    }

    return JWT_SECRET.sign(
      {
        email,
        referer,
        userID: user.id,
      },
      tokenOptions
    );
  }

  /**
   * verifyEmailConfirmationToken checks the validity of a given token without
   * actually confirming the user's email address.
   *
   * @param {String} token the token to verify
   */
  static async verifyEmailConfirmationToken(token) {
    if (!token) {
      throw new Error('cannot verify an empty token');
    }

    const decoded = await UsersService.verifyToken(token, {
      subject: EMAIL_CONFIRM_JWT_SUBJECT,
    });

    const user = await UserModel.findOne({
      id: decoded.userID,
      profiles: {
        $elemMatch: {
          id: decoded.email,
          provider: 'local',
        },
      },
    });
    if (!user) {
      throw errors.ErrNotFound;
    }

    const profile = user.profiles.find(({ id }) => id === decoded.email);
    if (!profile) {
      throw errors.ErrNotFound;
    }

    if (profile.metadata && profile.metadata.confirmed_at !== null) {
      throw errors.ErrEmailVerificationToken;
    }

    return decoded;
  }

  /**
   * This verifies that a given token was for the email confirmation and updates
   * that user's profile with a 'confirmed_at' parameter with the current date.
   * @param  {String} token the token containing the email confirmation details
   *                        signed with our secret.
   * @return {Promise}
   */
  static async verifyEmailConfirmation(token) {
    let {
      userID,
      email,
      referer,
    } = await UsersService.verifyEmailConfirmationToken(token);

    await UsersService.confirmEmail(userID, email);

    return { userID, email, referer };
  }

  /**
   * Marks the email on the user as confirmed.
   */
  static confirmEmail(id, email) {
    return UserModel.update(
      {
        id,
        profiles: {
          $elemMatch: {
            id: email,
            provider: 'local',
          },
        },
      },
      {
        $set: {
          'profiles.$.metadata.confirmed_at': new Date(),
        },
      }
    );
  }

  /**
   * Ignore another user
   * @param  {String} id the id of the user that is ignoring another users
   * @param  {Array<String>} usersToIgnore Array of user IDs to ignore
   */
  static async ignoreUsers(id, usersToIgnore) {
    if (usersToIgnore.includes(id)) {
      throw new Error('Users cannot ignore themselves');
    }

    const users = await UsersService.findByIdArray(usersToIgnore);
    if (some(users, user => user.isStaff())) {
      throw errors.ErrCannotIgnoreStaff;
    }

    return UserModel.update(
      { id },
      {
        $addToSet: {
          ignoresUsers: {
            $each: usersToIgnore,
          },
        },
      }
    );
  }

  /**
   * Stop ignoring other users
   * @param  {String} userId the id of the user that is ignoring another users
   * @param  {Array<String>} usersToStopIgnoring Array of user IDs to stop ignoring
   */
  static async stopIgnoringUsers(id, usersToStopIgnoring) {
    await UserModel.update(
      { id },
      {
        $pullAll: {
          ignoresUsers: usersToStopIgnoring,
        },
      }
    );
  }
}

module.exports = UsersService;

events.on(USERS_BAN_CHANGE, async (user, { status, message }) => {
  // Check to see if the user was banned now and is currently banned.
  if (user.banned && status && message && message.length > 0) {
    await UsersService.sendEmail(user, {
      template: 'plain',
      locals: {
        body: message,
      },
      subject: 'Your account has been banned',
    });
  }
});

events.on(USERS_SUSPENSION_CHANGE, async (user, { until, message }) => {
  // Check to see if the user was suspended now and is currently suspended.
  if (
    user.suspended &&
    until !== null &&
    until > Date.now() &&
    message &&
    message.length > 0
  ) {
    await UsersService.sendEmail(user, {
      template: 'plain',
      locals: {
        body: message,
      },
      subject: 'Your account has been suspended',
    });
  }
});

// Extract all the tokenUserNotFound plugins so we can integrate with other
// providers.
let tokenUserNotFoundHooks = null;

// Provide a function that can loop over the hooks and search for a provider
// can crack the token to a user.
const lookupUserNotFound = async token => {
  if (!Array.isArray(tokenUserNotFoundHooks)) {
    tokenUserNotFoundHooks = require('./plugins')
      .get('server', 'tokenUserNotFound')
      .map(({ plugin, tokenUserNotFound }) => {
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
