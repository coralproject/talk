const express = require('express');
const router = express.Router();
const Setting = require('../../../models/setting');

router.get('/', (req, res, next) => {
  Setting.getSettings().then(res.json.bind(res)).catch(next);
});

router.put('/', (req, res, next) => {
  Setting.updateSettings(req.body).then(res.json.bind(res)).catch(next);
});

module.exports = router;
