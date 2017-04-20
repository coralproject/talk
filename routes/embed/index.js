const express = require('express');
const router = express.Router();
const SettingsService = require('../../services/settings');

router.use('/:embed', (req, res, next) => {
  switch (req.params.embed) {
  case 'stream':
    return SettingsService.retrieve()
      .then(({customCssUrl}) => {
        const data = {
          TALK_RECAPTCHA_PUBLIC: process.env.TALK_RECAPTCHA_PUBLIC
        };

        return res.render('embed/stream', {customCssUrl, data});
      });
  default:

    // will return a 404.
    return next();
  }
});

module.exports = router;
