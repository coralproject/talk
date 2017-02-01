const express = require('express');
const router = express.Router();
const UsersService = require('../../../services/users');
const mailer = require('../../../services/mailer');
const authorization = require('../../../middleware/authorization');
const errors = require('../../../errors');

//==============================================================================
// ROUTES
//==============================================================================

router.get('/', authorization.needed(), (req, res, next) => {
  res.json(req.user);
});

// POST /email/confirm takes the password confirmation token available as a
// payload parameter and if it verifies, it updates the confirmed_at date on the
// local profile.
router.post('/email/confirm', (req, res, next) => {

  const {
    token
  } = req.body;

  if (!token) {
    return next(errors.ErrMissingToken);
  }

  UsersService
    .verifyEmailConfirmation(token)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => {
      next(err);
    });
});

/**
 * this endpoint takes an email (username) and checks if it belongs to a User account
 * if it does, create a JWT and send an email
 */
router.post('/password/reset', (req, res, next) => {
  const {email} = req.body;

  if (!email) {
    return next('you must submit an email when requesting a password.');
  }

  UsersService
    .createPasswordResetToken(email)
    .then((token) => {

      // Check to see if the token isn't defined.
      if (!token) {

        // As it isn't, don't send any emails!
        return;
      }

      return mailer.sendSimple({
        app: req.app,                                 // needed to render the templates.
        template: 'email/password-reset',             // needed to know which template to render!
        locals: {                                     // specifies the template locals.
          token,
          rootURL: process.env.TALK_ROOT_URL
        },
        subject: 'Password Reset',
        to: email
      });
    })
    .then(() => {

      // we want to send a 204 regardless of the user being found in the db
      // if we fail on missing emails, it would reveal if people are registered or not.
      res.status(204).end();
    })
    .catch((err) => {
      next(err);
    });
});

/**
 * expects 2 fields in the body of the request
 * 1) the token that was in the url of the email link {String}
 * 2) the new password {String}
 */
router.put('/password/reset', (req, res, next) => {

  const {
    token,
    password
  } = req.body;

  if (!token) {
    return next(errors.ErrMissingToken);
  }

  if (!password || password.length < 8) {
    return next(errors.ErrPasswordTooShort);
  }

  UsersService
    .verifyPasswordResetToken(token)
    .then(user => {
      return UsersService.changePassword(user.id, password);
    })
    .then(() => {
      res.status(204).end();
    })
    .catch(error => {
      console.error(error);

      next(authorization.ErrNotAuthorized);
    });
});

router.put('/displayname', authorization.needed(), (req, res, next) => {
  UsersService
    .editUsername(req.user.id, req.body.displayName)
    .then(() => {
      res.status(204).end();
    })
    .catch(next);
});

module.exports = router;
