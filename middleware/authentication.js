const {passport} = require('../services/passport');

const authentication = (req, res, next) => passport.authenticate('jwt', {
  session: false
}, (err, user) => {
  if (err) {
    return next(err);
  }

  if (user) {

    // Attach the user to the request object, now that we know it exists.
    req.user = user;
  }

  next();
})(req, res, next);

module.exports = authentication;
