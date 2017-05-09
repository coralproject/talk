const express = require('express');
const router = express.Router();
const UsersService = require('../../../services/users');
const mailer = require('../../../services/mailer');
const authorization = require('../../../middleware/authorization');
const errors = require('../../../errors');
const {
  ROOT_URL
} = require('../../../config');

//==============================================================================
// ROUTES
//==============================================================================

router.get('/', authorization.needed(), (req, res, next) => {
  res.json(req.user);
});

// POST /email/confirm takes the password confirmation token available as a
// payload parameter and if it verifies, it updates the confirmed_at date on the
// local profile.
router.post('/email/verify', (req, res, next) => {

  const {
    token
  } = req.body;

  if (!token) {
    return next(errors.ErrMissingToken);
  }

  UsersService
    .verifyEmailConfirmation(token)
    .then(({referer}) => {
      res.json({redirectUri: referer});
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
  const {email, loc} = req.body;

  if (!email) {
    return next('you must submit an email when requesting a password.');
  }

  UsersService
    .createPasswordResetToken(email, loc)
    .then((token) => {

      // Check to see if the token isn't defined.
      if (!token) {

        // As it isn't, don't send any emails!
        return;
      }

      return mailer.sendSimple({
        template: 'password-reset',             // needed to know which template to render!
        locals: {                                     // specifies the template locals.
          token,
          rootURL: ROOT_URL
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
    .then(([user, loc]) => {
      return Promise.all([UsersService.changePassword(user.id, password), loc]);
    })
    .then(([ , loc]) => {
      res.json({redirect: loc});
    })
    .catch(() => {
      next(authorization.ErrNotAuthorized);
    });
});

router.put('/username', authorization.needed(), (req, res, next) => {
  UsersService
    .editName(req.user.id, req.body.username)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
