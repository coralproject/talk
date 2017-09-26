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
router.post('/email/verify', async (req, res, next) => {

  const {
    token
  } = req.body;

  if (!token) {
    return next(errors.ErrMissingToken);
  }

  try {
    let {referer} = await UsersService.verifyEmailConfirmation(token);
    res.json({redirectUri: referer});
  } catch (e) {
    return next(e);
  }
});

/**
 * this endpoint takes an email (username) and checks if it belongs to a User account
 * if it does, create a JWT and send an email
 */
router.post('/password/reset', async (req, res, next) => {
  const {email, loc} = req.body;

  if (!email) {
    return next(errors.ErrMissingEmail);
  }

  try {
    let token = await UsersService.createPasswordResetToken(email, loc);
    if (token) {
      await mailer.sendSimple({
        template: 'password-reset',
        locals: {
          token,
        },
        subject: 'Password Reset',
        to: email
      });
    }

    res.status(204).end();
  } catch (e) {
    return next(e);
  }
});

/**
 * expects 2 fields in the body of the request
 * 1) the token that was in the url of the email link {String}
 * 2) the new password {String}
 */
router.put('/password/reset', async (req, res, next) => {
  const {check} = req.query;
  const {token, password} = req.body;

  if (!token) {
    return next(errors.ErrMissingToken);
  }

  if (check !== 'true' && (!password || password.length < 8)) {
    return next(errors.ErrPasswordTooShort);
  }

  try {
    let [user, loc] = await UsersService.verifyPasswordResetToken(token);
    if (check === 'true') {
      res.status(204).end();
      return;
    }

    // Change the users' password.
    await UsersService.changePassword(user.id, password);

    res.json({redirect: loc});
  } catch (e) {
    console.error(e);
    return next(errors.ErrNotAuthorized);
  }
});

router.put('/username', authorization.needed(), async (req, res, next) => {
  try {
    await UsersService.editName(req.user.id, req.body.username);
    res.status(204).end();
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
