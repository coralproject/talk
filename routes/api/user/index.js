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
      const {displayName, created_at} = user;
      return {
        displayName,
        created_at,
        profiles: user.toObject().profiles
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
    return User.count({
      profiles: {
        $elemMatch: {
          id: email,
          provider: 'local'
        }
      }
    })
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
