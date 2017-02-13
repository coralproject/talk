const passport = require('passport');
const UsersService = require('./users');
const SettingsService = require('./settings');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const errors = require('../errors');

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

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, (email, password, done) => {
  UsersService
    .findLocalUser(email, password)
    .then((user) => {
      if (!user) {
        return done(null, false, {message: 'Incorrect email/password combination'});
      }

      // Define the loginProfile being used to perform an additional
      // verificaiton.
      let loginProfile = {id: email, provider: 'local'};

      // Validate the user login.
      return ValidateUserLogin(loginProfile, user, done);
    })
    .catch((err) => {
      done(err);
    });
}));

if (process.env.TALK_FACEBOOK_APP_ID && process.env.TALK_FACEBOOK_APP_SECRET && process.env.TALK_ROOT_URL) {
  passport.use(new FacebookStrategy({
    clientID: process.env.TALK_FACEBOOK_APP_ID,
    clientSecret: process.env.TALK_FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.TALK_ROOT_URL}/api/v1/auth/facebook/callback`,

    // TODO: remove displayName reference when we have steps in the FE to handle
    // the username create flow.
    profileFields: ['id', 'displayName', 'picture.type(large)']
  }, (accessToken, refreshToken, profile, done) => {
    UsersService
      .findOrCreateExternalUser(profile)
      .then((user) => {
        return ValidateUserLogin(profile, user, done);
      })
      .catch((err) => {
        done(err);
      });
  }));
} else {
  console.error('Facebook cannot be enabled, missing one of TALK_FACEBOOK_APP_ID, TALK_FACEBOOK_APP_SECRET, TALK_ROOT_URL');
}

module.exports = passport;
