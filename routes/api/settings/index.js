const express = require('express');
const router = express.Router();
const path = require('path');
const Setting = require(path.resolve(__dirname, 'models/setting'));

router.get('/settings', (req, res, next) => {
  Setting.getSettings().then(res.json).catch(next);
});

router.put('/settings', (req, res, next) => {
  Setting.updateSettings(req.body).then(res.json).catch(next);
});

module.exports = router;
