const express = require('express');

const SetupService = require('../../../services/setup');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    await SetupService.isAvailable();
    res.json({ installed: false });
  } catch (e) {
    res.json({ installed: true });
  }
});

router.post('/', async (req, res, next) => {
  try {
    await SetupService.isAvailable();
  } catch (e) {
    return next(e);
  }

  const { settings, user: { email, password, username } } = req.body;

  try {
    await SetupService.setup({ settings, user: { email, password, username } });
    res.status(204).end();
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
