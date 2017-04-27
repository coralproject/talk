const session = require('./session');
const passport = require('./passport');

// Session data does not automatically attach to websocket req objects.
// This middleware code looks for a user in the session and, if it exists,
// attaches it to the graph req.
const deserializeUser = (req) => {
  return new Promise((resolve, reject) => {
    session(req, {}, () => {

      if ('session' in req && 'passport' in req.session && 'user' in req.session.passport) {
        passport.deserializeUser(req.session.passport.user, (err, user) => {
          if (err) {
            return reject(err);
          }

          req.user = user;

          return resolve(req);
        });
      }

        // Remove the user from the request (if there was one)
      if (req.user) {
        delete req.user;
      }

        // Resolve with the request (user removed possibly).
      return resolve(req);
    });
  });
};

module.exports = {
  deserializeUser
};
