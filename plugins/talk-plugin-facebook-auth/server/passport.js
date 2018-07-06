const FacebookStrategy = require('passport-facebook').Strategy;
const UsersService = require('services/users');
const { ValidateUserLogin } = require('services/passport');
let { ROOT_URL } = require('config');

if (ROOT_URL[ROOT_URL.length - 1] !== '/') {
  ROOT_URL += '/';
}

module.exports = passport => {
  if (
    process.env.TALK_FACEBOOK_APP_ID &&
    process.env.TALK_FACEBOOK_APP_SECRET &&
    process.env.TALK_ROOT_URL
  ) {
    passport.use(
      new FacebookStrategy(
        {
          clientID: process.env.TALK_FACEBOOK_APP_ID,
          clientSecret: process.env.TALK_FACEBOOK_APP_SECRET,
          callbackURL: `${ROOT_URL}api/v1/auth/facebook/callback`,
          passReqToCallback: true,
          profileFields: ['id', 'displayName', 'picture.type(large)'],
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
      'Facebook cannot be enabled, missing one of TALK_FACEBOOK_APP_ID, TALK_FACEBOOK_APP_SECRET, TALK_ROOT_URL'
    );
  }
};
