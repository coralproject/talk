const express = require('express');
const Setting = require('../../../models/setting');

const router = express.Router();

router.get('/', (req, res, next) => {
  Setting.retrieve().then((settings) => {
    res.json(settings);
  })
  .catch((err) => {
    next(err);
  });
});

router.put('/', (req, res, next) => {
  Setting.update(req.body).then(() => {
    res.status(204).end();
  })
  .catch((err) => {
    next(err);
  });
});

module.exports = router;
