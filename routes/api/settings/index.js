const express = require('express');
const router = express.Router();
const path = require('path');
const Setting = require(path.resolve(__dirname, 'models/setting'));

router.get('/settings', (req, res, next) => {
  Setting.getSettings().then(settings => {
    res.json(settings);
  }).catch(error => {
    next(error);
  });
});

router.put('/settings', (req, res, next) => {
  Setting.updateSettings(req.body).then(updatedSettings => {
    res.json(updatedSettings);
  }).catch(error => {
    next(error);
  });
});

module.exports = router;
