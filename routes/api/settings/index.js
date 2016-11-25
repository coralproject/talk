const express = require('express');
const Setting = require('../../../models/setting');
const _ = require('lodash');

const router = express.Router();

router.get('/', (req, res, next) => {
  Setting
    .getSettings()
    .then(settings => {
      const whitelist = ['moderation'];
      res.json(_.pick(settings, whitelist));
    })
    .catch(next);
});

router.put('/', (req, res, next) => {
  Setting
    .updateSettings(req.body)
    .then(() => res.status(204).end())
    .catch(next);
});

module.exports = router;
