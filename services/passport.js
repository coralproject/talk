const passport = require('passport');
const UsersService = require('./users');
const SettingsService = require('./settings');
const fetch = require('node-fetch');
const FormData = require('form-data');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const errors = require('../errors');
const debug = require('debug')('talk:passport');
const plugins = require('./plugins');

//==============================================================================
// SESSION SERIALIZATION
//==============================================================================

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  UsersService
    .findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err);
    });
});

/**
 * This sends back the user data as JSON.
 */
const HandleAuthCallback = (req, res, next) => (err, user) => {
  if (err) {
    return next(err);
  }

  if (!user) {
    return next(errors.ErrNotAuthorized);
  }

  // Perform the login of the user!
  req.logIn(user, (err) => {
    if (err) {
      return next(err);
    }

    // We logged in the user! Let's send back the user data and the CSRF token.
    res.json({user});
  });
};

/**
 * Returns the response to the login attempt via a popup callback with some JS.
 */
const HandleAuthPopupCallback = (req, res, next) => (err, user) => {
  if (err) {
    return res.render('auth-callback', {err: JSON.stringify(err), data: null});
  }

  if (!user) {
    return res.render('auth-callback', {err: JSON.stringify(errors.ErrNotAuthorized), data: null});
  }

  // Perform the login of the user!
  req.logIn(user, (err) => {
    if (err) {
      return res.render('auth-callback', {err: JSON.stringify(err), data: null});
    }

    // We logged in the user! Let's send back the user data.
    res.render('auth-callback', {err: null, data: JSON.stringify(user)});
  });
};

/**
 * Validates that a user is allowed to login.
 * @param {User}     user the user to be validated
 * @param {Function} done the callback for the validation
 */
function ValidateUserLogin(loginProfile, user, done) {
  if (!user) {
    return done(new Error('user not found'));
  }

  if (user.disabled) {
    return done(new errors.ErrAuthentication('Account disabled'));
  }

  // If the user isn't a local user (i.e., a social user).
  if (loginProfile.provider !== 'local') {
    return done(null, user);
  }

  // The user is a local user, check if we need email confirmation.
  return SettingsService.retrieve().then(({requireEmailConfirmation = false}) => {

    // If we have the requirement of checking that emails for users are
    // verified, then we need to check the email address to ensure that it has
    // been verified.
    if (requireEmailConfirmation) {

      // Get the profile representing the local account.
      let profile = user.profiles.find((profile) => profile.id === loginProfile.id);

      // This should never get to this point, if it does, don't let this past.
      if (!profile) {
        throw new Error('ID indicated by loginProfile is not on user object');
      }

      // If the profile doesn't have a metadata field, or it does not have a
      // confirmed_at field, or that field is null, then send them back.
      if (!profile.metadata || !profile.metadata.confirmed_at || profile.metadata.confirmed_at === null) {
        return done(new errors.ErrAuthentication(loginProfile.id));
      }
    }

    return done(null, user);
  });
}

//==============================================================================
// STRATEGIES
//==============================================================================

/**
 * This looks at the request headers to see if there is a recaptcha response on
 * the input request.
 */
const CheckIfRecaptcha = (req) => {
  let response = req.get('X-Recaptcha-Response');

  if (response && response.length > 0) {
    return true;
  }

  return false;
};

/**
 * This checks the user to see if the current email profile needs to get checked
 * for recaptcha compliance before being allowed to login.
 */
const CheckIfNeedsRecaptcha = (user, email) => {

  // Get the profile representing the local account.
  let profile = user.profiles.find((profile) => profile.id === email);

  // This should never get to this point, if it does, don't let this past.
  if (!profile) {
    throw new Error('ID indicated by loginProfile is not on user object');
  }

  if (profile.metadata && profile.metadata.recaptcha_required) {
    return true;
  }

  return false;
};

/**
 * This stores the Recaptcha secret.
 */
const RECAPTCHA_SECRET = process.env.TALK_RECAPTCHA_SECRET;
const RECAPTCHA_PUBLIC = process.env.TALK_RECAPTCHA_PUBLIC;

/**
 * This is true when the recaptcha secret is provided and the Recaptcha feature
 * is to be enabled.
 */
const RECAPTCHA_ENABLED = RECAPTCHA_SECRET && RECAPTCHA_SECRET.length > 0 && RECAPTCHA_PUBLIC && RECAPTCHA_PUBLIC.length > 0;
if (!RECAPTCHA_ENABLED) {
  console.log('Recaptcha is not enabled for login/signup abuse prevention, set TALK_RECAPTCHA_SECRET and TALK_RECAPTCHA_PUBLIC to enable Recaptcha.');
}

/**
 * This sends the request details down Google to check to see if the response is
 * genuine or not.
 * @return {Promise} resolves with the success status of the recaptcha
 */
const CheckRecaptcha = async (req) => {

  // Ask Google to verify the recaptcha response: https://developers.google.com/recaptcha/docs/verify
  const form = new FormData();

  form.append('secret', RECAPTCHA_SECRET);
  form.append('response', req.get('X-Recaptcha-Response'));
  form.append('remoteip', req.ip);

  // Perform the request.
  let res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    body: form,
    headers: form.getHeaders()
  });

  // Parse the JSON response.
  let json = await res.json();

  return json.success;
};

/**
 * This records a login attempt failure as well as optionally flags an account
 * for requiring a recaptcha in the future outside the temporary window.
 * @return {Promise} resolves with nothing if rate limit not exeeded, errors if
 *                   there is a rate limit error
 */
const HandleFailedAttempt = async (email, userNeedsRecaptcha) => {
  try {
    await UsersService.recordLoginAttempt(email);
  } catch (err) {
    if (err === errors.ErrLoginAttemptMaximumExceeded && !userNeedsRecaptcha && RECAPTCHA_ENABLED) {

      debug(`flagging user email=${email}`);
      await UsersService.flagForRecaptchaRequirement(email, true);
    }

    throw err;
  }
};

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {

  // We need to check if this request has a recaptcha on it at all, if it does,
  // we must verify it first. If verification fails, we fail the request early.
  // We can only do this obviously when recaptcha is enabled.
  let hasRecaptcha = CheckIfRecaptcha(req);
  let recaptchaPassed = false;
  if (RECAPTCHA_ENABLED && hasRecaptcha) {

    try {

      // Check to see if this recaptcha passed.
      recaptchaPassed = await CheckRecaptcha(req);
    } catch (err) {
      return done(err);
    }

    if (!recaptchaPassed) {
      try {
        await HandleFailedAttempt(email);
      } catch (err) {
        return done(err);
      }

      return done(null, false, {message: 'Incorrect recaptcha'});
    }
  }

  debug(`hasRecaptcha=${hasRecaptcha}, recaptchaPassed=${recaptchaPassed}`);

  // If the request didn't have a recaptcha, check to see if we did need one by
  // checking the rate limit against failed attempts on this email
  // address/login.
  if (!hasRecaptcha) {
    try {
      await UsersService.checkLoginAttempts(email);
    } catch (err) {
      if (err === errors.ErrLoginAttemptMaximumExceeded) {

        // This says, we didn't have a recaptcha, yet we needed one.. Reject
        // here.

        try {
          await HandleFailedAttempt(email);
        } catch (err) {
          return done(err);
        }

        return done(null, false, {message: 'Incorrect recaptcha'});
      }

      // Some other unexpected error occured.
      return done(err);
    }
  }

  // Let's find the user for which this login is connected to.
  let user;
  try {
    user = await UsersService.findLocalUser(email);
  } catch (err) {
    return done(err);
  }

  debug(`user=${user != null}`);

  // If the user doesn't exist, then mark this as a failed attempt at logging in
  // this non-existant user and continue.
  if (!user) {
    try {
      await HandleFailedAttempt(email);
    } catch (err) {
      return done(err);
    }

    return done(null, false, {message: 'Incorrect email/password combination'});
  }

  // Let's check if the user indeed needed recaptcha in order to authenticate.
  // We can only do this obviously when recaptcha is enabled.
  let userNeedsRecaptcha = false;
  if (RECAPTCHA_ENABLED && user) {
    userNeedsRecaptcha = CheckIfNeedsRecaptcha(user, email);
  }

  debug(`userNeedsRecaptcha=${userNeedsRecaptcha}`);

  // Let's check now if their password is correct.
  let userPasswordCorrect;
  try {
    userPasswordCorrect = await user.verifyPassword(password);
  } catch (err) {
    return done(err);
  }

  debug(`userPasswordCorrect=${userPasswordCorrect}`);

  // If their password wasn't correct, mark their attempt as failed and
  // continue.
  if (!userPasswordCorrect) {
    try {
      await HandleFailedAttempt(email, userNeedsRecaptcha);
    } catch (err) {
      return done(err);
    }

    return done(null, false, {message: 'Incorrect email/password combination'});
  }

  // If the user needed a recaptcha, yet we have gotten this far, this indicates
  // that the password was correct, so let's unflag their account for logins. We
  // can only do this obviously when recaptcha is enabled. The account wouldn't
  // have been flagged otherwise.
  if (RECAPTCHA_ENABLED && userNeedsRecaptcha) {
    try {
      await UsersService.flagForRecaptchaRequirement(email, false);
    } catch (err) {
      return done(err);
    }
  }

  // Define the loginProfile being used to perform an additional
  // verificaiton.
  let loginProfile = {id: email, provider: 'local'};

  // Perform final steps to login the user.
  return ValidateUserLogin(loginProfile, user, done);
}));

if (process.env.TALK_FACEBOOK_APP_ID && process.env.TALK_FACEBOOK_APP_SECRET && process.env.TALK_ROOT_URL) {
  passport.use(new FacebookStrategy({
    clientID: process.env.TALK_FACEBOOK_APP_ID,
    clientSecret: process.env.TALK_FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.TALK_ROOT_URL}/api/v1/auth/facebook/callback`,
    passReqToCallback: true,
    profileFields: ['id', 'displayName', 'picture.type(large)']
  }, async (req, accessToken, refreshToken, profile, done) => {

    let user;
    try {
      user = await UsersService.findOrCreateExternalUser(profile);
    } catch (err) {
      return done(err);
    }

    return ValidateUserLogin(profile, user, done);
  }));
} else {
  console.error('Facebook cannot be enabled, missing one of TALK_FACEBOOK_APP_ID, TALK_FACEBOOK_APP_SECRET, TALK_ROOT_URL');
}

// Inject server route plugins.
plugins.get('server', 'auth').forEach(({plugin, auth}) => {
  debug(`added plugin '${plugin.name}'`);

  // Pass the passport.js instance to the plugin to allow it to inject it's
  // functionality.
  auth(passport);
});

module.exports = {
  passport,
  ValidateUserLogin,
  HandleFailedAttempt,
  HandleAuthCallback,
  HandleAuthPopupCallback
};
