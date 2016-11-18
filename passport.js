const passport = require('passport');
const User = require('./models/user');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

//==============================================================================
// SESSION SERIALIZATION
//==============================================================================

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User
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
function ValidateUserLogin(user, done) {
  if (!user) {
    return done(new Error('user not found'));
  }

  if (user.disabled) {
    return done(null, false, {message: 'Account disabled'});
  }

  return done(null, user);
}

//==============================================================================
// STRATEGIES
//==============================================================================

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, (email, password, done) => {
  User
    .findLocalUser(email, password)
    .then((user) => {
      if (!user) {
        return done(null, false, {message: 'Incorrect email/password combination'});
      }

      return ValidateUserLogin(user, done);
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
    profileFields: ['id', 'displayName', 'picture.type(large)']
  }, (accessToken, refreshToken, profile, done) => {
    User
      .findOrCreateExternalUser(profile)
      .then((user) =>
         ValidateUserLogin(user, done)
      )
      .catch((err) => {
        done(err);
      });
  }));
} else {
  console.error('Facebook cannot be enabled, missing one of TALK_FACEBOOK_APP_ID, TALK_FACEBOOK_APP_SECRET, TALK_ROOT_URL');
}

module.exports = passport;
