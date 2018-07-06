const GoogleStrategy = require('passport-google-oauth2').Strategy;
const UsersService = require('services/users');
const { ValidateUserLogin } = require('services/passport');
let { ROOT_URL } = require('config');

if (ROOT_URL[ROOT_URL.length - 1] !== '/') {
  ROOT_URL += '/';
}

module.exports = passport => {
  if (
    process.env.TALK_GOOGLE_CLIENT_ID &&
    process.env.TALK_GOOGLE_CLIENT_SECRET &&
    process.env.TALK_ROOT_URL
  ) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.TALK_GOOGLE_CLIENT_ID,
          clientSecret: process.env.TALK_GOOGLE_CLIENT_SECRET,
          callbackURL: `${ROOT_URL}api/v1/auth/google/callback`,
          passReqToCallback: true,
        },
        async (req, accessToken, refreshToken, profile, done) => {
          let user;
          try {
            const { id, provider, displayName } = profile;

            user = await UsersService.upsertSocialUser(
              req.context,
              id,
              provider,
              displayName
            );
          } catch (err) {
            return done(err);
          }

          return ValidateUserLogin(profile, user, done);
        }
      )
    );
  } else if (process.env.NODE_ENV !== 'test') {
    throw new Error(
      'Google cannot be enabled, missing one of TALK_GOOGLE_CLIENT_ID, TALK_GOOGLE_CLIENT_SECRET, TALK_ROOT_URL'
    );
  }
};
