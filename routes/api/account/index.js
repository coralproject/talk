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
  const {token, check} = req.body;

  if (!token) {
    return next(errors.ErrEmailVerificationToken);
  }

  if (check) {
    try {
      await UsersService.verifyEmailConfirmationToken(token);
      return res.status(204).end();
    } catch (err) {
      console.error(err);
      return next(errors.ErrEmailVerificationToken);
    }
  }

  try {
    let {referer} = await UsersService.verifyEmailConfirmation(token);
    return res.json({redirectUri: referer});
  } catch (err) {
    console.error(err);
    return next(errors.ErrEmailVerificationToken);
  }
});

router.post('/password/reset', async (req, res, next) => {
  const {email, loc} = req.body;

  if (!email) {
    return next(errors.ErrMissingEmail);
  }

  try {
    let token = await UsersService.createPasswordResetToken(email, loc);
    if (token) {
      await mailer.send({
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

router.put('/password/reset', async (req, res, next) => {
  const {token, password, check = false} = req.body;

  if (!token) {
    return next(errors.ErrPasswordResetToken);
  }

  if (check) {
    try {
      await UsersService.verifyPasswordResetToken(token);
      return res.status(204).end();
    } catch (err) {
      console.error(err);
      return next(errors.ErrPasswordResetToken);
    }
  }

  if (!password || password.length < 8) {
    return next(errors.ErrPasswordTooShort);
  }

  try {
    let [user, redirect] = await UsersService.verifyPasswordResetToken(token);

    // Change the users' password.
    await UsersService.changePassword(user.id, password);

    res.json({redirect});
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
