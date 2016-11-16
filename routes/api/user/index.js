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
  User
    .addRoleToUser(req.params.user_id, req.body.role)
    .then(role => {
      res.send(role);
    })
    .catch(next);
});

module.exports = router;
