const express = require('express');
const passport = require('../../../services/passport');
const authorization = require('../../../middleware/authorization');

const router = express.Router();

const csrf = require('csurf');
const bodyParser = require('body-parser');

// Setup route middlewares for CSRF protection.
// Default ignore methods are GET, HEAD, OPTIONS
const csrfProtection = csrf({});
const parseForm = bodyParser.urlencoded({extended: false});

/**
 * This returns the user if they are logged in.
 */
router.get('/', (req, res, next) => {
  if (req.user) {
    return next();
  }

  // When there is no user on the request, then just send back a 204 to this
  // request. It's not really "an error" if what they asked for isn't available,
  // but it could be.
  res.status(204).end();
}, (req, res) => {

  // Send back the user object.
  res.json(req.user.toObject());
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
router.post('/local', parseForm, csrfProtection, (req, res, next) => {

  // Perform the local authentication.
  passport.authenticate('local', HandleAuthCallback(req, res, next))(req, res, next);
});

/**
 * Facebook auth endpoint, this will redirect the user immediatly to facebook
 * for authorization.
 */
router.get('/facebook', passport.authenticate('facebook', {display: 'popup', authType: 'rerequest', scope: ['public_profile']}));

/**
 * Facebook callback endpoint, this will send the user a html page designed to
 * send back the user credentials upon sucesfull login.
 */
router.get('/facebook/callback', (req, res, next) => {

  // Perform the facebook login flow and pass the data back through the opener.
  passport.authenticate('facebook', HandleAuthPopupCallback(req, res, next))(req, res, next);
});

module.exports = router;
