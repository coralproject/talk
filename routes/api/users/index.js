const express = require('express');
const router = express.Router();
const UsersService = require('../../../services/users');
const CommentsService = require('../../../services/comments');
const mailer = require('../../../services/mailer');
const errors = require('../../../errors');
const authorization = require('../../../middleware/authorization');
const {
  ROOT_URL
} = require('../../../config');

// get a list of users.
router.get('/', authorization.needed('ADMIN'), (req, res, next) => {
  const {
    value = '',
    field = 'created_at',
    page = 1,
    asc = 'false',
    limit = 50 // Total Per Page
  } = req.query;

  Promise.all([
    UsersService
      .search(value)
      .sort({[field]: (asc === 'true') ? 1 : -1})
      .skip((page - 1) * limit)
      .limit(limit),
    UsersService.count()
  ])
  .then(([result, count]) => {
    res.json({
      result,
      limit: Number(limit),
      count,
      page: Number(page),
      totalPages: Math.ceil(count / (limit === 0 ? 1 : limit))
    });
  })
  .catch(next);
});

router.post('/:user_id/role', authorization.needed('ADMIN'), (req, res, next) => {
  UsersService
    .addRoleToUser(req.params.user_id, req.body.role)
    .then(() => {
      res.status(204).end();
    })
    .catch(next);
});

// update the status of a user
router.post('/:user_id/status', authorization.needed('ADMIN'), (req, res, next) => {
  UsersService
    .setStatus(req.params.user_id, req.body.status)
    .then((status) => {
      res.status(201).json(status);

      if (status === 'BANNED' && req.body.comment_id) {
        return CommentsService.pushStatus(req.body.comment_id, 'rejected', req.params.user_id);
      }
    })
    .catch(next);
});

router.post('/:user_id/username-enable', authorization.needed('ADMIN'), (req, res, next) => {
  UsersService
    .toggleNameEdit(req.params.user_id, true)
    .then(() => {
      res.status(204).end();
    });
});

router.post('/:user_id/email', authorization.needed('ADMIN'), (req, res, next) => {

  UsersService.findById(req.params.user_id)
    .then(user => {
      let localProfile = user.profiles.find((profile) => profile.provider === 'local');

      if (localProfile) {
        const options =
          {
            template: 'notification',                     // needed to know which template to render!
            locals: {                                     // specifies the template locals.
              body: req.body.body
            },
            subject: req.body.subject,
            to: localProfile.id      // This only works if the user has registered via e-mail.
                                        // We may want a standard way to access a user's e-mail address in the future
          };
        return mailer.sendSimple(options);
      } else {
        res.json({error: 'User does not have an e-mail address.'});
      }
    })
    .then(() => {
      res.status(204).end();
    })
    .catch(next);
});

/**
 * SendEmailConfirmation sends a confirmation email to the user.
 * @param {ExpressApp} app     the instance of the express app
 * @param {String}     userID  the id for the user to send the email to
 * @param {String}     email   the email for the user to send the email to
 */
const SendEmailConfirmation = (app, userID, email, referer) => UsersService
  .createEmailConfirmToken(userID, email, referer)
  .then((token) => {
    return mailer.sendSimple({
      template: 'email-confirm',              // needed to know which template to render!
      locals: {                                     // specifies the template locals.
        token,
        rootURL: ROOT_URL,
        email
      },
      subject: 'Email Confirmation',
      to: email
    });
  });

// create a local user.
router.post('/', (req, res, next) => {
  const {email, password, username} = req.body;
  const redirectUri = req.header('X-Pym-Url') || req.header('Referer');

  UsersService
    .createLocalUser(email, password, username)
    .then((user) => {

      // Send an email confirmation. The Front end will know about the
      // requireEmailConfirmation as it's included in the settings get endpoint.
      return SendEmailConfirmation(req.app, user.id, email, redirectUri)
        .then(() => {

          // Then send back the user.
          res.status(201).json(user);
        });
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/:user_id/actions', authorization.needed(), (req, res, next) => {
  const {
    action_type,
    metadata
  } = req.body;

  UsersService
    .addAction(req.params.user_id, req.user.id, action_type, metadata)
    .then((action) => {

      // Set the user status to "pending" for review by moderators
      if (action_type === 'FLAG') {
        return UsersService.setStatus(req.params.user_id, 'PENDING')
          .then(() => action);
      } else {
        return action;
      }
    })
    .then((action) => {
      res.status(201).json(action);
    })
    .catch((err) => {
      next(err);
    });
});

// trigger an email confirmation re-send by a new user
router.post('/resend-verify', (req, res, next) => {
  const {email} = req.body;
  const redirectUri = req.header('X-Pym-Url') || req.header('Referer');

  if (!email) {
    return next(errors.ErrMissingEmail);
  }

  // find user by email.
  // if the local profile is verified, return an error code?
  // send a 204 after the email is re-sent
  SendEmailConfirmation(req.app, null, email, redirectUri)
    .then(() => {
      res.status(204).end();
    })
    .catch(next);
});

// trigger an email confirmation re-send from the admin panel
router.post('/:user_id/email/confirm', authorization.needed('ADMIN'), (req, res, next) => {
  const {
    user_id
  } = req.params;

  UsersService
    .findById(user_id)
    .then((user) => {
      if (!user) {
        res.status(404).end();
        return;
      }

      // Find the first local profile.
      let localProfile = user.profiles.find((profile) => profile.provider === 'local');

      // If there was no local profile for the user, error out.
      if (!localProfile) {
        res.status(404).end();
        return;
      }

      // Send the email to the first local profile that was found.
      return SendEmailConfirmation(req.app, user.id, localProfile.id)
        .then(() => {
          res.status(204).end();
        });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
