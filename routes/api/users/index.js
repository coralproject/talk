const express = require('express');
const router = express.Router();
const UsersService = require('../../../services/users');
const mailer = require('../../../services/mailer');
const errors = require('../../../errors');
const authorization = require('../../../middleware/authorization');
const i18n = require('../../../services/i18n');
const Limit = require('../../../services/limit');
const {
  ROOT_URL
} = require('../../../config');

router.get('/', authorization.needed('ADMIN', 'MODERATOR'), async (req, res, next) => {

  const {
    value = '',
    field = 'created_at',
    page = 1,
    asc = 'false',
    limit = 20 // Total Per Page
  } = req.query;

  try {

    const queryOpts = {
      sort: {[field]: (asc === 'true') ? 1 : -1},
      skip: (page - 1) * limit,
      limit
    };

    let [result, count] = await Promise.all([
      UsersService
        .search(value)
        .sort(queryOpts.sort)
        .skip(parseInt(queryOpts.skip))
        .limit(parseInt(queryOpts.limit))
        .lean(),
      UsersService.search(value).count()
    ]);

    res.json({
      result,
      limit: Number(limit),
      count,
      page: Number(page),
      totalPages: Math.ceil(count / (limit === 0 ? 1 : limit))
    });

  } catch (e) {
    next(e);
  }
});

router.post('/:user_id/role', authorization.needed('ADMIN', 'MODERATOR'), async (req, res, next) => {
  try {
    await UsersService.addRoleToUser(req.params.user_id, req.body.role);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

// update the status of a user
router.post('/:user_id/status', authorization.needed('ADMIN', 'MODERATOR'), async (req, res, next) => {
  let {status} = req.body;

  try {
    let user = await UsersService.setStatus(req.params.user_id, status);
    if (!user) {
      return next(errors.ErrNotFound);
    }

    if (user.status === 'BANNED') {
      req.pubsub.publish('userBanned', user);
    }

    // TODO: investigate why this is returning a value? Also why is this a POST vs PUT?
    res.status(201).json(user.status);
  } catch (e) {
    next(e);
  }
});

router.post('/:user_id/username-enable', authorization.needed('ADMIN', 'MODERATOR'), async (req, res, next) => {
  try {
    await UsersService.toggleNameEdit(req.params.user_id, true);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

router.post('/:user_id/email', authorization.needed('ADMIN', 'MODERATOR'), async (req, res, next) => {
  try {
    let user = await UsersService.findById(req.params.user_id);

    let localProfile = user.profiles.find((profile) => profile.provider === 'local');
    if (!localProfile) {
      return next(errors.ErrMissingEmail);
    }

    await mailer.send({
      template: 'notification',  // needed to know which template to render!
      locals: {                  // specifies the template locals.
        body: req.body.body
      },
      subject: req.body.subject,
      to: localProfile.id        // This only works if the user has registered via e-mail.
    });

    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

/**
 * SendEmailConfirmation sends a confirmation email to the user.
 * @param {String}     userID  the id for the user to send the email to
 * @param {String}     email   the email for the user to send the email to
 */
const SendEmailConfirmation = async (user, email, referer) => {
  let token = await UsersService.createEmailConfirmToken(user, email, referer);

  return mailer.send({
    template: 'email-confirm',
    locals: {
      token,
      rootURL: ROOT_URL,
      email
    },
    subject: i18n.t('email.confirm.subject'),
    to: email
  });
};

// create a local user.
router.post('/', async (req, res, next) => {
  const {email, password, username} = req.body;
  const redirectUri = req.header('X-Pym-Url') || req.header('Referer');

  try {
    let user = await UsersService.createLocalUser(email, password, username);

    // Send an email confirmation. The Front end will know about the
    // requireEmailConfirmation as it's included in the settings get endpoint.
    await SendEmailConfirmation(user, email, redirectUri);

    res.status(201).json(user);
  } catch (e) {
    return next(e);
  }
});

router.post('/:user_id/actions', authorization.needed(), async (req, res, next) => {
  const {
    action_type,
    metadata
  } = req.body;

  try {
    let action = await UsersService.addAction(req.params.user_id, req.user.id, action_type, metadata);

    // Set the user status to "pending" for review by moderators
    if (action_type === 'FLAG') {
      await UsersService.setStatus(req.params.user_id, 'PENDING');
    }

    res.status(201).json(action);
  } catch (e) {
    return next(e);
  }
});

// This will allow 1 try every minute.
const resendRateLimiter = new Limit('/api/v1/users/resend-verify', 1, '1m');

// trigger an email confirmation re-send by a new user
router.post('/resend-verify', async (req, res, next) => {
  const redirectUri = req.header('X-Pym-Url') || req.header('Referer');
  let {email = ''} = req.body;

  // Clean up and validate the email.
  email = email.toLowerCase().trim();
  if (email.length < 5) {
    return next(errors.ErrMissingEmail);
  }

  // Check if we're past the rate limit, if we are, stop now. Otherwise, record
  // this as an attempt to send a verification email.
  try {
    const tries = await resendRateLimiter.get(email);
    if (tries > 0) {
      throw errors.ErrMaxRateLimit;
    }

    await resendRateLimiter.test(email);
  } catch (err) {
    return next(err);
  }

  try {
    const user = await UsersService.findLocalUser(email);
    if (!user) {
      throw errors.ErrNotFound;
    }

    await SendEmailConfirmation(user, email, redirectUri);

    res.status(204).end();
  } catch (e) {
    console.trace(e);
    res.status(204).end();
  }
});

// trigger an email confirmation re-send from the admin panel
router.post('/:user_id/email/confirm', authorization.needed('ADMIN', 'MODERATOR'), async (req, res, next) => {
  const {
    user_id
  } = req.params;

  try {

    let user = await UsersService.findById(user_id);
    if (!user) {
      return next(errors.ErrNotFound);
    }

    // Find the first local profile.
    let localProfile = user.profiles.find((profile) => profile.provider === 'local');
    if (!localProfile) {
      return next(errors.ErrMissingEmail);
    }

    // Send the email to the first local profile that was found.
    await SendEmailConfirmation(user, localProfile.id);

    res.status(204).end();
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
