const express = require('express');
const router = express.Router();
const SettingsService = require('../../services/settings');

router.use('/:embed', (req, res, next) => {
  switch (req.params.embed) {
  case 'stream':
    return SettingsService.retrieve()
      .then(({customCssUrl}) => {
        return res.render('embed/stream', {customCssUrl});
      });
  default:

    // will return a 404.
    return next();
  }
});

module.exports = router;
