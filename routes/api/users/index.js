const express = require('express');
const router = express.Router();
const User = require('../../../models/user');
const mailer = require('../../../services/mailer');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const resetEmailFile = fs.readFileSync(path.resolve(__dirname, '../../../views/password-reset-email.ejs'));
const resetEmailTemplate = ejs.compile(resetEmailFile.toString());
const notificationEmailFile = fs.readFileSync(path.resolve(__dirname, '../../../views/notification-email.ejs'));
const notificationEmailTemplate = ejs.compile(notificationEmailFile.toString());
const authorization = require('../../../middleware/authorization');

const csrf = require('csurf');
const bodyParser = require('body-parser');

// Setup route middlewares for CSRF protection.
// Default ignore methods are GET, HEAD, OPTIONS
const csrfProtection = csrf({});
const parseForm = bodyParser.urlencoded({extended: false});

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

router.post('/:user_id/role', parseForm, csrfProtection, authorization.needed('admin'), (req, res, next) => {
  User
    .addRoleToUser(req.params.user_id, req.body.role)
    .then(() => {
      res.status(204).end();
    })
    .catch(next);
});

router.post('/:user_id/status', parseForm, csrfProtection, (req, res, next) => {
  User
    .setStatus(req.params.user_id, req.body.status, req.body.comment_id)
    .then(status => {
      res.json(status);
    })
    .catch(next);
});

router.post('/:user_id/email', authorization.needed('admin'), parseForm, csrfProtection, (req, res, next) => {
  User.find(req.user_id)
    .then(user => {
      const options = {
        subject: req.subject,
        from: process.env.TALK_SMTP_FROM_ADDRESS,
        to: user.email,
        html: notificationEmailTemplate({
          body: req.body
        })
      };

      return mailer.sendSimple(options);
    })
    .then(() => {
      res.status(204).end();
    });
});

router.post('/', parseForm, csrfProtection, (req, res, next) => {
  const {email, password, displayName} = req.body;

  User
    .createLocalUser(email, password, displayName)
    .then(user => {

      res.status(201).json(user);
    })
    .catch(err => {
      next(err);
    });
});

const ErrPasswordTooShort = new Error('password must be at least 8 characters');
ErrPasswordTooShort.status = 400;

/**
 * expects 2 fields in the body of the request
 * 1) the token that was in the url of the email link {String}
 * 2) the new password {String}
 */
router.post('/update-password', parseForm, csrfProtection, (req, res, next) => {
  const {token, password} = req.body;

  if (!password || password.length < 8) {
    return next(ErrPasswordTooShort);
  }

  User.verifyPasswordResetToken(token)
    .then(user => {
      return User.changePassword(user.id, password);
    })
    .then(() => {
      res.status(204).end();
    })
    .catch(error => {
      console.error(error);

      next(authorization.ErrNotAuthorized);
    });
});

/**
 * this endpoint takes an email (username) and checks if it belongs to a User account
 * if it does, create a JWT and send an email
 */
router.post('/request-password-reset', parseForm, csrfProtection, (req, res, next) => {
  const {email} = req.body;

  if (!email) {
    return next('you must submit an email when requesting a password.');
  }

  User
    .createPasswordResetToken(email)
    .then(token => {
      if (token === null) {
        return Promise.resolve('the email was not found in the db.');
      }

      const options = {
        subject: 'Password Reset Requested - Talk',
        from: process.env.TALK_SMTP_FROM_ADDRESS,
        to: email,
        html: resetEmailTemplate({
          token,

          // probably more clear to explicitly pass this
          rootURL: process.env.TALK_ROOT_URL
        })
      };
      return mailer.sendSimple(options);
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

router.put('/:user_id/bio', (req, res, next) => {
  const {user_id} = req.params;
  const {bio} = req.body;

  if (!bio) {
    return next('You must submit a new bio');
  }

  User
    .addBio(user_id, bio)
    .then(user => {
      res.json(user);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/:user_id/actions',  parseForm, csrfProtection, authorization.needed(), (req, res, next) => {
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
