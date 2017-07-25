const express = require('express');
const SettingsService = require('../../../services/settings');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    let settings = await SettingsService.retrieve();
    res.json(settings);
  } catch (e) {
    return next(e);
  }
});

router.put('/', async (req, res, next) => {
  try {
    await SettingsService.update(req.body);
    res.status(204).end();
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
