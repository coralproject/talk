const express = require('express');
const router = express.Router();
const User = require('../../../models/user');
const mailer = require('../../../services/mailer');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const resetEmailFile = fs.readFileSync(path.resolve(__dirname, '../../../views/password-reset-email.ejs'));
const resetEmailTemplate = ejs.compile(resetEmailFile.toString());
const authorization = require('../../../middleware/authorization');
const debug = require('debug')('talk:users');

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
  .then(([data, count]) => {
    const users = data.map((user) => {
      const {id, displayName, created_at} = user;
      return {
        id,
        displayName,
        created_at,
        profiles: user.toObject().profiles,
        roles: user.toObject().roles
      };
    });

    res.json({
      result: users,
      limit: Number(limit),
      count,
      page: Number(page),
      totalPages: Math.ceil(count / limit)
    });

  })
  .catch(next);
});

router.post('/:user_id/role', authorization.needed('admin'), (req, res, next) => {
  User
    .addRoleToUser(req.params.user_id, req.body.role)
    .then(role => {
      res.send(role);
    })
    .catch(next);
});

router.post('/', (req, res, next) => {
  const {email, password, displayName} = req.body;

  User
    .createLocalUser(email, password, displayName)
    .then(user => {
      res.status(201).send(user);
    })
    .catch(err => {
      next(err);
    });
});

/**
 * expects 2 fields in the body of the request
 * 1) the token that was in the url of the email link {String}
 * 2) the new password {String}
 */
router.post('/update-password', (req, res, next) => {
  const {token, password} = req.body;

  if (!password || password.length < 8) {
    return res.status(400).send('Password must be at least 8 characters');
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
      res.status(401).send('Not Authorized');
    });
});

/**
 * this endpoint takes an email (username) and checks if it belongs to a User account
 * if it does, create a JWT and send an email
 */
router.post('/request-password-reset', (req, res, next) => {
  const {email} = req.body;

  debug('/request-password-reset body %s', JSON.stringify(req.body, null, 2));

  if (!email) {
    return next('you must submit an email when requesting a password.');
  }

  User
    .createPasswordResetToken(email)
    .then(token => {
      if (token === null) {
        debug('back in the route. the token was null for some reason %s', token);
        return Promise.resolve('the email was not found in the db.');
      }

      const options = {
        subject: 'Password Reset Requested - Talk',
        from: 'noreply@coralproject.net',
        to: email,
        html: resetEmailTemplate({
          token,
          // probably more clear to explicitly pass this
          rootURL: process.env.TALK_ROOT_URL
        })
      };

      debug('about to send a simple email with the options %s', JSON.stringify(options, null, 2));

      return mailer.sendSimple(options);
    })
    .then(() => {

      debug('password reset email sent successfully');

      // we want to send a 204 regardless of the user being found in the db
      // if we fail on missing emails, it would reveal if people are registered or not.
      res.status(204).end();
    })
    .catch(error => {
      const errorMsg = typeof error === 'string' ? error : error.message;

      debug('there was an error sending your email %s', error);

      res.status(500).json({error: errorMsg});
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
    .then(user => res.status(200).send(user))
    .catch(error => {
      const errorMsg = typeof error === 'string' ? error : error.message;
      res.status(500).json({error: errorMsg});
    });
});

module.exports = router;
