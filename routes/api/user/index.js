const express = require('express');
const router = express.Router();
const User = require('../../../models/user');

router.get('/', (req, res, next) => {
  const {
    value = '',
    limit = 50,
    offset = 0,
    field = 'created_at',
    asc = 'false'
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

  const buildSort = () => ({
    [`${field}`]: (asc === 'true') ? 1 : -1
  });

  Promise.all([
    User.find(q)
      .sort(buildSort())
      .skip(offset)
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
      count,
      limit,
      offset
    });
  })
  .catch(next);
});

module.exports = router;
