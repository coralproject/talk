const express = require('express');
const url = require('url');
const router = express.Router();

const { MOUNT_PATH } = require('../../url');
const SetupService = require('../../services/setup');
const staticTemplate = require('../../middleware/staticTemplate');

router.use('/assets', staticTemplate, require('./assets'));
router.get('/', staticTemplate, async (req, res) => {
  try {
    await SetupService.isAvailable();
    return res.redirect(url.resolve(MOUNT_PATH, 'admin/install'));
  } catch (e) {
    return res.render('dev/article.njk', {
      title: 'Coral Talk',
      asset_url: '',
      asset_id: '',
    });
  }
});

module.exports = router;
