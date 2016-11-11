const express = require('express');
const passport = require('../../../passport');
const authorization = require('../../../middleware/authorization');

const router = express.Router();

/**
 * This returns the user if they are logged in.
 */
router.get('/', authorization.needed(), (req, res) => {
  res.json(req.user);
});

/**
 * This destroys the session of a user, if they have one.
 */
router.delete('/', authorization.needed(), (req, res) => {
  req.session.destroy(() => {
    res.status(204).end();
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
};

/**
 * Returns the response to the login attempt via a popup callback with some JS.
 */
const HandleAuthPopupCallback = (req, res, next) => (err, user) => {
  if (err) {
    return res.render('auth-callback', {err: JSON.stringify(err), data: null});
  }

  if (!user) {
    return res.render('auth-callback', {err: JSON.stringify(authorization.ErrNotAuthorized), data: null});
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
 * Local auth endpoint, will recieve a email and password
 */
router.post('/local', (req, res, next) => {

  // Perform the local authentication.
  passport.authenticate('local', HandleAuthCallback(req, res, next))(req, res, next);
});

/**
 * Facebook auth endpoint, this will redirect the user immediatly to facebook
 * for authorization.
 */
router.get('/facebook', passport.authenticate('facebook', {display: 'popup'}));

/**
 * Facebook callback endpoint, this will send the user a html page designed to
 * send back the user credentials upon sucesfull login.
 */
router.get('/facebook/callback', (req, res, next) => {

  // Perform the facebook login flow and pass the data back through the opener.
  passport.authenticate('facebook', HandleAuthPopupCallback(req, res, next))(req, res, next);
});

module.exports = router;
