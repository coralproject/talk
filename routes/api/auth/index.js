const express = require('express');
const passport = require('../../../services/passport');
const authorization = require('../../../middleware/authorization');
const errors = require('../../../errors');
const UsersService = require('../../../services/users');

const router = express.Router();

/**
 * This returns the user if they are logged in.
 */
router.get('/', (req, res, next) => {

  if (req.user) {
    return next();
  }

  res.status(204).end();
}, (req, res) => {

  // Send back the user object.
  res.json({user: req.user});
});

/**
 * This destroys the session of a user, if they have one.
 */
router.delete('/', authorization.needed(), (req, res) => {
  delete req.session.passport;

  res.status(204).end();
});

//==============================================================================
// PASSPORT ROUTES
//==============================================================================

/**
 * This sends back the user data as JSON.
 */
const HandleAuthCallback = (req, res, next) => (err, user) => {
  if (err) {
    return next(err);
  }

  if (!user) {
    return next(errors.ErrNotAuthorized);
  }

  // Perform the login of the user!
  req.logIn(user, (err) => {
    if (err) {
      return next(err);
    }

    // We logged in the user! Let's send back the user data and the CSRF token.
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
    return res.render('auth-callback', {err: JSON.stringify(errors.ErrNotAuthorized), data: null});
  }

  // Authorize the user to edit their username.
  UsersService.toggleNameEdit(user.id, true)
    .then(() => {
      
      // Perform the login of the user!
      req.logIn(user, (err) => {
        if (err) {
          return res.render('auth-callback', {err: JSON.stringify(err), data: null});
        }

        // We logged in the user! Let's send back the user data.
        res.render('auth-callback', {err: null, data: JSON.stringify(user)});
      });
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
