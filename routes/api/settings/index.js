const express = require('express');
const SettingsService = require('../../../services/settings');

const router = express.Router();

router.get('/', (req, res, next) => {
  SettingsService
    .retrieve().then((settings) => {
      res.json(settings);
    })
    .catch((err) => {
      next(err);
    });
});

router.put('/', (req, res, next) => {
  SettingsService
    .update(req.body).then(() => {
      res.status(204).end();
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
