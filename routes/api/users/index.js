const express = require('express');
const router = express.Router();
const User = require('../../../models/user');
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

router.post('/', authorization.needed('admin'), (req, res, next) => {
  const {
    email,
    password,
    displayName
  } = req.body;

  User
    .createLocalUser(email, password, displayName)
    .then(user => {
      res.status(201).json(user);
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
