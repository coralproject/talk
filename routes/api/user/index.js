const express = require('express');
const router = express.Router();
const User = require('../../../models/user');

router.get('/', (req, res, next) => {
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
      const {id, displayName, created_at, status} = user;
      return {
        id,
        displayName,
        created_at,
        status,
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
  User
    .addRoleToUser(req.params.user_id, req.body.role)
    .then(role => {
      res.send(role);
    })
    .catch(next);
});

router.post('/:user_id/status', (req, res, next) => {
  User
    .setStatus(req.params.user_id, req.body.status)
    .then(status => {
      res.send(status);
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

router.post('/availability', (req, res, next) => {
  const {email} = req.body;

  if (email) {
    return User.availabilityCheck(email)
      .then(count => {
        if (count) {
          return res.json({status: 'unavailable'});
        }
        return res.json({status: 'available'});
      })
      .catch(err => {
        next(err);
      });
  }
  return res.status(404).send('Wrong parameters');
});

module.exports = router;
