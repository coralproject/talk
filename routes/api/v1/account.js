const express = require('express');
const router = express.Router();
const UsersService = require('../../../services/users');
const mailer = require('../../../services/mailer');
const authorization = require('../../../middleware/authorization');
const errors = require('../../../errors');

// Return the current logged in user.
router.get('/', authorization.needed(), (req, res, next) => {
  res.json(req.user);
});

/**
 * verifyTokenOnCheck will verify that the request contains a token, and if
 * being checked, will return the check status to the user.
 *
 * @param {Function} verifier the function used to verify the token, will throw on error
 * @param {Object} error the error object to send back in the event an error is found
 */
const tokenCheck = (verifier, error, ...whitelistedErrors) => async (
  req,
  res,
  next
) => {
  const { token = null, check = false } = req.body;

  if (check) {
    // This request is checking to see if the token is valid.
    try {
      // Verify the token.
      await verifier(token);
    } catch (err) {
      if (whitelistedErrors.includes(err)) {
        return next(err);
      }

      // Log out the error, slurp it and send out the predefined error to the
      // error handler.
      console.error(err);
      return next(new error());
    }

    res.status(204).end();

    // Don't continue to pass it onto the next middleware, as we've only been
    // asked to verify the token.
    return;
  }

  next();
};

// Takes the password confirmation token available as a payload parameter and if
// it verifies, it updates the confirmed_at date on the local profile.
router.post(
  '/email/verify',
  tokenCheck(
    UsersService.verifyEmailConfirmationToken,
    errors.ErrEmailVerificationToken,
    errors.ErrEmailAlreadyVerified
  ),
  async (req, res, next) => {
    const { token } = req.body;

    try {
      let { referer } = await UsersService.verifyEmailConfirmation(token);
      return res.json({ redirectUri: referer });
    } catch (err) {
      console.error(err);
      return next(errors.ErrEmailVerificationToken);
    }
  }
);

// Sends the password reset email if the user exists.
router.post('/password/reset', async (req, res, next) => {
  const { email, loc } = req.body;

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
        subject: res.locals.t('email.password_reset.subject'),
        email,
      });
    }

    res.status(204).end();
  } catch (e) {
    return next(e);
  }
});

// Executes the password reset.
router.put(
  '/password/reset',
  tokenCheck(
    UsersService.verifyPasswordResetToken,
    errors.ErrPasswordResetToken
  ),
  async (req, res, next) => {
    const { token, password } = req.body;

    try {
      const { redirect } = await UsersService.resetPassword(token, password);
      res.json({ redirect });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
