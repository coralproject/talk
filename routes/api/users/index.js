const express = require('express');
const router = express.Router();
const UsersService = require('../../../services/users');
const mailer = require('../../../services/mailer');
const errors = require('../../../errors');
const authorization = require('../../../middleware/authorization');
const i18n = require('../../../services/i18n');
const {
  ROOT_URL
} = require('../../../config');

// get a list of users.
router.get('/', authorization.needed('ADMIN', 'MODERATOR'), async (req, res, next) => {
  const {
    value = '',
    field = 'created_at',
    page = 1,
    asc = 'false',
    limit = 50 // Total Per Page
  } = req.query;

  try {

    let [result, count] = await Promise.all([
      UsersService
        .search(value)
        .sort({[field]: (asc === 'true') ? 1 : -1})
        .skip((page - 1) * limit)
        .limit(limit),
      UsersService.count()
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

    await mailer.sendSimple({
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
 * @param {ExpressApp} app     the instance of the express app
 * @param {String}     userID  the id for the user to send the email to
 * @param {String}     email   the email for the user to send the email to
 */
const SendEmailConfirmation = async (app, userID, email, referer) => {
  let token = await UsersService.createEmailConfirmToken(userID, email, referer);

  return mailer.sendSimple({
    template: 'email-confirm',              // needed to know which template to render!
    locals: {                               // specifies the template locals.
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
    await SendEmailConfirmation(req.app, user.id, email, redirectUri);

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

// trigger an email confirmation re-send by a new user
router.post('/resend-verify', async (req, res, next) => {
  const {email} = req.body;
  const redirectUri = req.header('X-Pym-Url') || req.header('Referer');

  if (!email) {
    return next(errors.ErrMissingEmail);
  }

  try {

    // find user by email.
    // if the local profile is verified, return an error code?
    // send a 204 after the email is re-sent
    await SendEmailConfirmation(req.app, null, email, redirectUri);

    res.status(204).end();
  } catch (e) {
    return next(e);
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
    await SendEmailConfirmation(req.app, user.id, localProfile.id);

    res.status(204).end();
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
