const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  return res.render('dev/amp.njk', {
    title: 'Coral Talk AMP',
    asset_url: '',
    asset_id: '',
  });
});

router.get('/button', (req, res) => {
  return res.render('dev/amp-button.njk', {
    title: 'Coral Talk AMP',
    asset_url: '',
    asset_id: '',
  });
});

module.exports = router;
