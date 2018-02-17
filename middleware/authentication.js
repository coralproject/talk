const { passport } = require('../services/passport');
const debug = require('debug')('talk:middleware:authentication');

const authentication = (req, res, next) =>
  passport.authenticate(
    'jwt',
    {
      session: false,
    },
    (err, user) => {
      if (err) {
        debug(`cannot get the user: ${err}`);
        return next(err);
      }

      if (user) {
        debug('user was on request');

        // Attach the user to the request object, now that we know it exists.
        req.user = user;
      } else {
        debug('user was not on request');
      }

      next();
    }
  )(req, res, next);

module.exports = authentication;
