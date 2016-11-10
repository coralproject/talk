const express = require('express');
const router = express.Router();
const User = require('../../../models/user');

router.get('/', (req, res, next) => {
  const {value = '', limit = 50, sort = '-createdAt'} = req.query;
  let q = new RegExp(`^${value}`);

  User
    .find({
      $or: [
        {
          'displayName': {
            $regex: q,
            $options: 'i'
          },
          'profiles': {
            $elemMatch: {
              id: {
                $regex: q,
                $options: 'i'
              },
              provider: 'local'
            }
          }
        }
      ]
    })
    .limit(limit)
    .sort(sort)
    .then((users) => {
      res.json(
        users.map((user) => ({
          displayName: user.displayName,
          createdAt: user.created_at,
          email: user.toObject().profiles[0].id
        }))
      );
    })
    .catch(next);
});

module.exports = router;
