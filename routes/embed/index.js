const express = require('express');
const router = express.Router();
const SettingsService = require('../../services/settings');

router.use('/:embed', async (req, res, next) => {
  switch (req.params.embed) {
  case 'stream': {
    const {customCssUrl} = await SettingsService.retrieve('customCssUrl');
    return res.render('embed/stream', {customCssUrl});
  }
  }

  return next();
});

module.exports = router;
