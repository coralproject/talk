const express = require('express');
const passport = require('../../../passport');
const authorization = require('../../../middleware/authorization');

const router = express.Router();

router.get('/', authorization.needed(), (req, res) => {
  res.json(req.user);
});

router.delete('/', (req, res) => {
  req.logout();
  res.status(204).end();
});

/**
 * Local auth endpoint, will recieve a email and password
 */
router.post('/local', (req, res, next) => {

  // Perform the local authentication.
  passport.authenticate('local', (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return next(authorization.ErrNotAuthorized);
    }

    // Perform the login of the user!
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      // We logged in the user! Let's send back the user data.
      res.json({user});
    });
  })(req, res, next);
});

module.exports = router;
