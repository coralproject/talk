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
 * this endpoint takes an email (username) and checks if it belongs to a User account
 * if it does, create a JWT and send an email
 */
router.post('/request-password-reset', (req, res, next) => {
  const {email} = req.body;

  console.log('/request-password-reset', req.body);

  if (!email) {
    return next();
  }

  User
    .createJWT(email)
    .then(token => {
      const options = {
        subject: 'password reset requested',
        from: 'coralcore@mozillafoundation.org',
        to: 'riley.davis@gmail.com',
        html: `<a href="http://localhost:3000/admin/password-reset/${token}">reset password</a>`
      };
      return mailer.sendSimple(options);
    })
    .then(success => {
      console.log(success);
      res.json({success: true});
    })
    .catch(error => {
      res.status(500).json({error});
    });
});

module.exports = router;
