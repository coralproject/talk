const uuid = require('uuid');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const {
  ErrMaxRateLimit,
  ErrLoginAttemptMaximumExceeded,
  ErrNotFound,
  ErrPermissionUpdateUsername,
  ErrSameUsernameProvided,
  ErrUsernameTaken,
  ErrMissingUsername,
  ErrSpecialChars,
  ErrMissingPassword,
  ErrPasswordTooShort,
  ErrMissingEmail,
  ErrEmailTaken,
  ErrEmailAlreadyVerified,
  ErrCannotIgnoreStaff,
} = require('../errors');
const { difference, sample, some, merge, random } = require('lodash');
const {
  ROOT_URL,
  RECAPTCHA_WINDOW,
  RECAPTCHA_INCORRECT_TRIGGER,
} = require('../config');
const { jwt: JWT_SECRET } = require('../secrets');
const debug = require('debug')('talk:services:users');
const User = require('../models/user');
const Actions = require('./actions');
const mailer = require('./mailer');
const i18n = require('./i18n');
const Wordlist = require('./wordlist');
const DomainList = require('./domain_list');
const Limit = require('./limit');
const { get } = require('lodash');

const EMAIL_CONFIRM_JWT_SUBJECT = 'email_confirm';
const PASSWORD_RESET_JWT_SUBJECT = 'password_reset';

// SALT_ROUNDS is the number of rounds that the bcrypt algorithm will run
// through during the salting process.
const SALT_ROUNDS = 10;

// Create a redis client to use for authentication.
const loginRateLimiter = new Limit(
  'loginAttempts',
  RECAPTCHA_INCORRECT_TRIGGER,
  RECAPTCHA_WINDOW
);

// upsertUser will try to lookup the user by their profile. If the user cannot
// be looked up, it will create one with a unique username and the designated
// username status.
async function upsertUser(
  ctx,
  id,
  provider,
  displayName,
  usernameStatus,
  shouldSetDisplayName = false
) {
  let user = await User.findOne({
    id,
    profiles: {
      $elemMatch: {
        id,
        provider,
      },
    },
  });
  if (user) {
    user.wasUpserted = false;
    user.$ignore('wasUpserted');
    return user;
  }

  // User does not exist and need to be created.

  // Create an initial username for the user.
  let username = await Users.getInitialUsername(displayName);

  // The user was not found, lets create them!
  user = new User({
    id,
    username,
    lowercaseUsername: username.toLowerCase(),
    profiles: [{ id, provider }],
    status: {
      username: {
        status: usernameStatus,
        history: [{ status: usernameStatus }],
      },
    },
  });

  if (shouldSetDisplayName) {
    // Set the displayName on the user metadata so that it can be accessed.
    user.metadata = user.metadata || {};
    user.metadata.displayName = displayName;
  }

  // Save the user in the database.
  await user.save();

  if (ctx) {
    // Emit that the user was created if the context is set.
    ctx.pubsub.publish('userCreated', user);
  }

  // Indicate that the user was upserted.
  user.wasUpserted = true;
  user.$ignore('wasUpserted');

  return user;
}

// Users is the interface for the application to interact with the
// User through.
class Users {
  /**
   * Returns a user (if found) for the given email address.
   */
  static findLocalUser(email) {
    return User.findOne({
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
      if (err instanceof ErrMaxRateLimit) {
        throw new ErrLoginAttemptMaximumExceeded();
      }

      throw err;
    }
  }

  static async setSuspensionStatus(id, until, assignedBy = null, message) {
    let user = await User.findOneAndUpdate(
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
      user = await User.findOne({ id });
      if (user === null) {
        throw new ErrNotFound();
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

    // Check to see if the user was suspended now and is currently suspended.
    if (user.suspended && message && message.length > 0) {
      await Users.sendEmail(user, {
        template: 'plain',
        locals: {
          body: message,
        },
        subject: 'Your account has been suspended', // TODO: replace with translation
      });
    }

    return user;
  }

  static async setAlwaysPremodStatus(id, status, assignedBy = null) {
    let user = await User.findOneAndUpdate(
      {
        id,
        'status.alwaysPremod.status': {
          $ne: status,
        },
      },
      {
        $set: {
          'status.alwaysPremod.status': status,
        },
        $push: {
          'status.alwaysPremod.history': {
            status,
            assigned_by: assignedBy,
            created_at: Date.now(),
          },
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      user = await User.findOne({ id });
      if (!user) {
        throw new ErrNotFound();
      }

      if (user.status.alwaysPremod.status === status) {
        return user;
      }

      throw new Error(
        'always premod status change edit failed for an unknown reason'
      );
    }

    return user;
  }

  static async setBanStatus(id, status, assignedBy = null, message) {
    let user = await User.findOneAndUpdate(
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
    if (!user) {
      user = await User.findOne({ id });
      if (!user) {
        throw new ErrNotFound();
      }

      if (user.status.banned.status === status) {
        return user;
      }

      throw new Error('ban status change edit failed for an unknown reason');
    }

    // Check to see if the user was banned now and is currently banned.
    if (user.banned && status && message && message.length > 0) {
      await Users.sendEmail(user, {
        template: 'plain',
        locals: {
          body: message,
        },
        subject: 'Your account has been banned',
      });
    }

    return user;
  }

  static async setUsernameStatus(id, status, assignedBy = null) {
    let user = await User.findOneAndUpdate(
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
      user = await User.findOne({ id });
      if (user === null) {
        throw new ErrNotFound();
      }

      if (user.status.username.status === status) {
        return user;
      }

      throw new Error(
        'username status change edit failed for an unknown reason'
      );
    }

    return user;
  }

  static async setUsername(id, username, assignedBy) {
    try {
      const oldestEditTime = moment()
        .subtract(14, 'days')
        .toDate();

      // A username can be set if:
      //
      // - The previous status was 'UNSET'
      // - The username has not been changed within the last 14 days.
      const query = {
        id,
        $or: [
          {
            'status.username.status': 'UNSET',
          },
          {
            'status.username.status': { $in: ['APPROVED', 'SET'] },
            $or: [
              {
                'status.username.history.created_at': {
                  $lte: oldestEditTime,
                },
              },
              {
                'status.username.history': [],
              },
              {
                'status.username.history': { $exists: false },
              },
            ],
          },
        ],
      };

      const update = {
        $set: {
          username,
          lowercaseUsername: username.toLowerCase(),
          'status.username.status': 'SET',
        },
        $push: {
          'status.username.history': {
            status: 'SET',
            assigned_by: assignedBy,
            created_at: Date.now(),
          },
        },
      };

      let user = await User.findOneAndUpdate(query, update, {
        new: true,
      });
      if (!user) {
        user = await Users.findById(id);
        if (user === null) {
          throw new ErrNotFound();
        }

        if (
          !['UNSET', 'APPROVED', 'SET'].includes(user.status.username.status) ||
          user.status.username.history.some(({ created_at }) =>
            moment(created_at).isAfter(oldestEditTime)
          )
        ) {
          throw new ErrPermissionUpdateUsername();
        }

        throw new Error('edit username failed for an unexpected reason');
      }

      return user;
    } catch (err) {
      if (err.code === 11000) {
        throw new ErrUsernameTaken();
      }

      throw err;
    }
  }

  static async changeUsername(id, username, assignedBy) {
    try {
      const query = {
        id,
        username: { $ne: username },
        'status.username.status': 'REJECTED',
      };

      const update = {
        $set: {
          username,
          lowercaseUsername: username.toLowerCase(),
          'status.username.status': 'CHANGED',
        },
        $push: {
          'status.username.history': {
            status: 'CHANGED',
            assigned_by: assignedBy,
            created_at: Date.now(),
          },
        },
      };

      let user = await User.findOneAndUpdate(query, update, {
        new: true,
      });
      if (!user) {
        user = await Users.findById(id);
        if (user === null) {
          throw new ErrNotFound();
        }

        if (user.status.username.status !== 'REJECTED') {
          throw new ErrPermissionUpdateUsername();
        }

        if (user.username === username) {
          throw new ErrSameUsernameProvided();
        }

        throw new Error('edit username failed for an unexpected reason');
      }

      return user;
    } catch (err) {
      if (err.code === 11000) {
        throw new ErrUsernameTaken();
      }

      throw err;
    }
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
      throw new ErrLoginAttemptMaximumExceeded();
    }
  }

  /**
   * Sets or removes the recaptcha_required flag on a user's local profile.
   */
  static flagForRecaptchaRequirement(email, required) {
    return User.update(
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
   * Creates the initial username for an external account. Searches to make
   * sure username not already used. Adds a random number if username already
   * in use.
   */
  static async getInitialUsername(username) {
    const MAX_ATTEMPTS = 10;
    const END_NUMBER_MAX = 99999;
    const GROUP_ATTEMPTS = 50;

    // Cast the original username.
    const castedName = Users.castUsername(username);
    const lowercaseUsername = castedName.toLowerCase();

    // Try to see if our first guess has been taken.
    const existingUserWithName = await User.findOne({
      lowercaseUsername,
    });
    if (!existingUserWithName) {
      return castedName;
    }

    // Our first username was taken, lets try to find a non-taken name.
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      // Generate `GROUP_ATTEMPTS` guesses for the username.
      const usernameGuesses = Array.from(Array(GROUP_ATTEMPTS)).map(
        () => `${castedName}_${random(0, END_NUMBER_MAX)}`
      );

      // Map them all to lowercase.
      const lowercaseUsernameGuesses = usernameGuesses.map(guess =>
        guess.toLowerCase()
      );

      // See if any of these users aren't taken already.
      const existingUsernames = (await User.find(
        {
          lowercaseUsername: { $in: lowercaseUsernameGuesses },
        },
        { lowercaseUsername: 1 }
      )).map(({ lowercaseUsername }) => lowercaseUsername);
      if (existingUsernames.length === lowercaseUsernameGuesses.length) {
        // The number of found users is the same as the number of username
        // guesses, aka, all the usernames are taken.
        continue;
      }

      // At least one of the usernames wasn't taken! Let's filter this to only
      // include unused usernames and grab one random entry from the list.
      const foundLowercaseUsernameIndex = lowercaseUsernameGuesses.indexOf(
        sample(difference(lowercaseUsernameGuesses, existingUsernames))
      );

      // Now we get the uppercase version of that string.
      return usernameGuesses[foundLowercaseUsernameIndex];
    }

    throw new Error(
      'cannot find free name after ' +
        (MAX_ATTEMPTS * GROUP_ATTEMPTS + 1) +
        ' tries'
    );
  }

  /**
   * upsertExternalUser will create or lookup a user where the user will not be
   * able to change their username.
   *
   * @param {Object} ctx the graph context
   * @param {String} id the ID for the user from the provider
   * @param {String} provider the name of the provider
   * @param {String} displayName the users desired displayName, not guaranteed
   */
  static async upsertExternalUser(ctx, id, provider, displayName) {
    return upsertUser(ctx, id, provider, displayName, 'SET', true);
  }

  /**
   * upsertSocialUser will create or lookup a user as provided from a social
   * graph.
   *
   * @param {Object} ctx the graph context
   * @param {String} id the ID for the user from the provider
   * @param {String} provider the name of the provider
   * @param {String} displayName the users desired displayName, not guaranteed
   */
  static async upsertSocialUser(ctx, id, provider, displayName) {
    return upsertUser(ctx, id, provider, displayName, 'UNSET');
  }

  /**
   * Finds a user given a social profile and if the user does not exist, creates
   * them.
   */
  static async findOrCreateExternalUser(ctx, id, provider, displayName) {
    ctx.log.warn(
      'findOrCreateExternalUser is deprecated and will be removed in a future version, replace with upsertExternalUser'
    );

    return Users.upsertSocialUser(ctx, id, provider, displayName);
  }

  /**
   * sendEmailConfirmation sends a confirmation email to the user.
   *
   * @param {String}     user  the user to send the email to
   * @param {String}     email the email for the user to send the email to
   */
  static async sendEmailConfirmation(user, email, redirectURI = ROOT_URL) {
    let token = await Users.createEmailConfirmToken(user, email, redirectURI);

    return mailer.send({
      template: 'email-confirm',
      locals: {
        token,
        rootURL: ROOT_URL,
        email,
      },
      subject: i18n.t('email.confirm.subject'),
      email,
    });
  }

  static async sendEmail(user, options) {
    return mailer.send(
      merge({}, options, {
        user: user.id,
      })
    );
  }

  static async changePassword(id, password) {
    if (!password || password.length < 8) {
      throw new ErrPasswordTooShort();
    }

    const hashedPassword = await Users.hashPassword(password);

    return User.update(
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
   * Check the requested username for blocked words and special chars
   * @param  {String}   username              word to be checked for profanity
   * @param  {Boolean}  checkAgainstWordlist  enables cheching against the wordlist
   * @return {Promise}
   */
  static async isValidUsername(username, checkAgainstWordlist = true) {
    const onlyLettersNumbersUnderscore = /^[A-Za-z0-9_]+$/;

    if (!username) {
      throw new ErrMissingUsername();
    }

    if (!onlyLettersNumbersUnderscore.test(username)) {
      throw new ErrSpecialChars();
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
      throw new ErrMissingPassword();
    }

    if (password.length < 8) {
      throw new ErrPasswordTooShort();
    }

    return password;
  }

  /**
   * Creates the local user with a given email, password, and name.
   * @param  {Object}   ctx         application context for the request
   * @param  {String}   email       email of the new user
   * @param  {String}   password    plaintext password of the new user
   * @param  {String}   username    name of the display user
   */
  static async createLocalUser(ctx, email, password, username) {
    if (!email) {
      throw new ErrMissingEmail();
    }

    email = email.toLowerCase().trim();
    username = username.trim();

    await Promise.all([
      Users.isValidUsername(username),
      Users.isValidPassword(password),
    ]);

    const hashedPassword = await Users.hashPassword(password);

    let user = new User({
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
          throw new ErrUsernameTaken();
        }
        throw new ErrEmailTaken();
      }
      throw err;
    }

    // Emit that the user was created.
    ctx.pubsub.publish('userCreated', user);

    return user;
  }

  /**
   * Sets a given user's role to the one provided.
   * @param  {String}   id   id of a user
   * @param  {String}   role role to add
   */
  static setRole(id, role) {
    return User.update({ id }, { $set: { role } }, { runValidators: true });
  }

  /**
   * Finds a user with the id.
   * @param {String} id  user id (uuid)
   */
  static findById(id) {
    return User.findOne({ id });
  }

  /**
   *
   * @param {String} id  the id of the current user
   * @param {Object} token  a jwt token used to sign in the user
   */
  static async findOrCreateByIDToken(id, token) {
    // FIXME: (wyattjoh) adding the `{ 'profiles.id': id }` search condition is
    // a workaround for the `upsertExternalUser` bug where the ID being set was
    // incorrect. Patch the user creation functions to adapt to the correct
    // behavior. Thankfully, this is currently still covered by an index.

    // Try to get the user.
    let user = await User.findOne({ $or: [{ id }, { 'profiles.id': id }] });

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
    return User.find({
      id: { $in: ids },
    });
  }

  /**
   * Finds public user information by an array of ids.
   * @param {Array} ids  array of user identifiers (uuid)
   */
  static findPublicByIdArray(ids) {
    return User.find(
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
      throw new ErrMissingEmail();
    }

    email = email.toLowerCase();

    const [user, domainValidated] = await Promise.all([
      User.findOne({ profiles: { $elemMatch: { id: email } } }),
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

  // TODO: update doc
  static async verifyPasswordResetToken(token) {
    if (!token) {
      throw new Error('cannot verify an empty token');
    }

    const { userId, loc: redirect, version } = await Users.verifyToken(token, {
      subject: PASSWORD_RESET_JWT_SUBJECT,
    });

    const user = await Users.findById(userId);

    if (version !== user.__v) {
      throw new Error('password reset token has expired');
    }

    return { user, redirect, version };
  }

  static async hashPassword(password) {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  // TODO: update doc
  static async resetPassword(token, password) {
    const { user, redirect, version } = await this.verifyPasswordResetToken(
      token
    );

    if (!password || password.length < 8) {
      throw new ErrPasswordTooShort();
    }

    const hashedPassword = await Users.hashPassword(password);

    // Update the user's password.
    await User.update(
      { id: user.id, __v: version },
      {
        $inc: { __v: 1 },
        $set: {
          password: hashedPassword,
        },
      }
    );

    return { user, redirect };
  }

  /**
   * Returns a count of the current users.
   * @return {Promise}
   */
  static count(query = {}) {
    return User.count(query);
  }

  /**
   * Returns all the users.
   * @return {Promise}
   */
  static all() {
    return User.find();
  }

  /**
   * Updates the user's settings.
   * @return {Promise}
   */
  static updateSettings(id, settings) {
    return User.update(
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
    return Actions.create({
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
      throw new ErrEmailAlreadyVerified();
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

    const decoded = await Users.verifyToken(token, {
      subject: EMAIL_CONFIRM_JWT_SUBJECT,
    });

    const user = await User.findOne({
      id: decoded.userID,
      profiles: {
        $elemMatch: {
          id: decoded.email,
          provider: 'local',
        },
      },
    });
    if (!user) {
      throw new ErrNotFound();
    }

    const profile = user.profiles.find(({ id }) => id === decoded.email);
    if (!profile) {
      throw new ErrNotFound();
    }

    // Check to see if the profile has already been confirmed.
    const confirmedAt = get(profile, 'metadata.confirmed_at', null);
    if (confirmedAt && confirmedAt < Date.now()) {
      throw new ErrEmailAlreadyVerified();
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
    let { userID, email, referer } = await Users.verifyEmailConfirmationToken(
      token
    );

    await Users.confirmEmail(userID, email);

    return { userID, email, referer };
  }

  /**
   * Marks the email on the user as confirmed.
   */
  static confirmEmail(id, email) {
    return User.update(
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

    const users = await Users.findByIdArray(usersToIgnore);
    if (some(users, user => user.isStaff())) {
      throw new ErrCannotIgnoreStaff();
    }

    return User.update(
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
    await User.update(
      { id },
      {
        $pullAll: {
          ignoresUsers: usersToStopIgnoring,
        },
      }
    );
  }
}

module.exports = Users;

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
