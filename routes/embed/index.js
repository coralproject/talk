const express = require('express');
const router = express.Router();
const SettingsService = require('../../services/settings');
const {data} = require('../static');

router.use('/:embed', async (req, res, next) => {
  switch (req.params.embed) {
  case 'stream': {
    const {customCssUrl} = await SettingsService.retrieve();
    return res.render('embed/stream', {customCssUrl, data});
  }
  }

  return next();
});

module.exports = router;
