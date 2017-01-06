const express = require('express');
const router = express.Router();
const User = require('../../../models/user');
const Setting = require('../../../models/setting');
const mailer = require('../../../services/mailer');
const authorization = require('../../../middleware/authorization');

router.get('/', authorization.needed('admin'), (req, res, next) => {
  const {
    value = '',
    field = 'created_at',
    page = 1,
    asc = 'false',
    limit = 50 // Total Per Page
  } = req.query;

  Promise.all([
    User
      .search(value)
      .sort({[field]: (asc === 'true') ? 1 : -1})
      .skip((page - 1) * limit)
      .limit(limit),
    User.count()
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

router.post('/:user_id/role', authorization.needed('admin'), (req, res, next) => {
  User
    .addRoleToUser(req.params.user_id, req.body.role)
    .then(() => {
      res.status(204).end();
    })
    .catch(next);
});

router.post('/:user_id/status', (req, res, next) => {
  User
    .setStatus(req.params.user_id, req.body.status, req.body.comment_id)
    .then((status) => {
      res.status(201).json(status);
    })
    .catch(next);
});

router.post('/', (req, res, next) => {
  const {
    email,
    password,
    displayName
  } = req.body;

  User
    .createLocalUser(email, password, displayName)
    .then((user) => {

      // Get the settings from the database to find out if we need to send an
      // email confirmation. The Front end will know about the
      // requireEmailConfirmation as it's included in the settings get endpoint.
      return Setting.retrieve().then(({requireEmailConfirmation = false}) => {

        if (requireEmailConfirmation) {

          // Email confirmation is required, let's generate that token and send
          // the email.
          return User
            .createEmailConfirmToken(user.id, email)
            .then((token) => {
              return mailer.sendSimple({
                app: req.app,                                 // needed to render the templates.
                template: 'email/email-confirm',              // needed to know which template to render!
                locals: {                                     // specifies the template locals.
                  token,
                  rootURL: process.env.TALK_ROOT_URL,
                  email
                },
                subject: 'Email Confirmation - Talk',
                to: email
              });
            })
            .then(() => {

              // Then send back the user.
              res.status(201).json(user);
            });
        } else {

          // We don't need to confirm the email, let's just send back the user!
          res.status(201).json(user);
        }
      });
    })
    .catch(err => {
      next(err);
    });
});

router.post('/:user_id/actions', authorization.needed(), (req, res, next) => {

  const {
    action_type,
    metadata
  } = req.body;

  User
    .addAction(req.params.user_id, req.user.id, action_type, metadata)
    .then((action) => {
      res.status(201).json(action);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
