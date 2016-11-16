const express = require('express');
const router = express.Router();
const User = require('../../../models/user');
const mailer = require('../../../services/mailer');

router.get('/', (req, res, next) => {
  const {
    value = '',
    field = 'created_at',
    page = 1,
    asc = 'false',
    limit = 50 // Total Per Page
    } = req.query;

  let q = {
    $or: [
      {
        'displayName': {
          $regex: new RegExp(`^${value}`),
          $options: 'i'
        },
        'profiles': {
          $elemMatch: {
            id: {
              $regex: new RegExp(`^${value}`),
              $options: 'i'
            },
            provider: 'local'
          }
        }
      }
    ]
  };

  Promise.all([
    User.find(q)
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

router.post('/:user_id/role', (req, res, next) => {
  User.addRoleToUser(req.params.user_id, req.body.role)
  .then(role => {
    res.send(role);
  })
  .catch(next);
});

/**
 * expects 2 fields in the body of the request
 * 1) the token that was in the url of the email link {String}
 * 2) the new password {String}
 */
router.post('/update-password', (req, res, next) => {
  const {token, password} = req.body;

  User.verifyToken(token)
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

  if (!email) {
    return next();
  }

  User
    .createJWT(email)
    .then(token => {
      const options = {
        subject: 'Password Reset Requested - Talk',
        from: 'coralcore@mozillafoundation.org',
        to: email,
        html: `<p>We received a request to reset your password. If you did not request this change, you can ignore this email.
                If you did, <a href="http://localhost:3000/admin/password-reset/${token}">please click here to reset password</a>.</p>
                ${process.env.NODE_ENV === 'production' ? '' : `<p style="color: red">${token}</p>`}`
      };
      return mailer.sendSimple(options);
    })
    .then(() => {
      res.json({success: true});
    })
    .catch(error => {
      const errorMsg = typeof error === 'string' ? error : error.message;

      res.status(500).json({error: errorMsg});
    });
});

module.exports = router;
