const express = require('express');
const router = express.Router();
const UsersService = require('../../../services/users');
const { getRedirectUri } = require('../../../services/utils');
const { ErrMissingEmail, ErrNotFound } = require('../../../errors');
const authorization = require('../../../middleware/authorization');
const Limit = require('../../../services/limit');

// create a local user.
router.post('/', async (req, res, next) => {
  const { email, password, username } = req.body;
  const redirectUri = getRedirectUri(req);

  try {
    // Adjusted the user creation endpoint.
    let user = await UsersService.createLocalUser(
      req.context,
      email,
      password,
      username
    );

    // Send an email confirmation. The Front end will know about the
    // requireEmailConfirmation as it's included in the settings get endpoint.
    await UsersService.sendEmailConfirmation(user, email, redirectUri);

    res.status(201).json(user);
  } catch (e) {
    return next(e);
  }
});

// This will allow 1 try every minute.
const resendRateLimiter = new Limit('/api/v1/users/resend-verify', 1, '1m');

// trigger an email confirmation re-send by a new user
router.post('/resend-verify', async (req, res, next) => {
  const redirectUri = req.header('X-Pym-Url') || req.header('Referer');
  let { email = '' } = req.body;

  // Clean up and validate the email.
  email = email.toLowerCase().trim();
  if (email.length < 5) {
    return next(new ErrMissingEmail());
  }

  // Check if we're past the rate limit, if we are, stop now. Otherwise, record
  // this as an attempt to send a verification email.
  try {
    await resendRateLimiter.test(email);
  } catch (err) {
    return next(err);
  }

  try {
    const user = await UsersService.findLocalUser(email);
    if (!user) {
      throw new ErrNotFound();
    }

    await UsersService.sendEmailConfirmation(user, email, redirectUri);

    res.status(204).end();
  } catch (e) {
    console.trace(e);
    res.status(204).end();
  }
});

// trigger an email confirmation re-send from the admin panel
router.post(
  '/:user_id/email/confirm',
  authorization.needed('ADMIN', 'MODERATOR'),
  async (req, res, next) => {
    const { user_id } = req.params;

    try {
      let user = await UsersService.findById(user_id);
      if (!user) {
        return next(new ErrNotFound());
      }

      // Find the first local profile.
      const email = user.firstEmail;
      if (!email) {
        return next(new ErrMissingEmail());
      }

      // Send the email to the first local profile that was found.
      await UsersService.sendEmailConfirmation(user, email);

      res.status(204).end();
    } catch (e) {
      return next(e);
    }
  }
);

module.exports = router;
