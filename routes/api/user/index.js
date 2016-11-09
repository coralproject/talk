const express = require('express');
const router = express.Router();
const User = require('../../../models/user');

router.get('/', (req, res, next) => {
  const {limit, skip} = req.query;
  User.find({})
    .skip(skip)
    .limit(limit)
    .then((users) => {
      res.json(users);
    })
    .catch(next);
});

module.exports = router;
