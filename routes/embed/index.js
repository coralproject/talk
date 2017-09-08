const express = require('express');
const router = express.Router();
const SettingsService = require('../../services/settings');
const {
  RECAPTCHA_PUBLIC,
  WEBSOCKET_LIVE_URI,
} = require('../../config');

router.use('/:embed', async (req, res, next) => {
  switch (req.params.embed) {
  case 'stream': {
    const {customCssUrl} = await SettingsService.retrieve();
    const data = {
      TALK_RECAPTCHA_PUBLIC: RECAPTCHA_PUBLIC,
      LIVE_URI: WEBSOCKET_LIVE_URI,
    };

    return res.render('embed/stream', {customCssUrl, data});
  }
  }

  return next();
});

module.exports = router;
