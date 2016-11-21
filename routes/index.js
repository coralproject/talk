const express = require('express');
const router = express.Router();

router.use('/api/v1', require('./api'));
router.use('/admin', require('./admin'));
router.use('/embed', require('./embed'));

router.get('/', (req, res) => {
  return res.render('article', {title: 'Coral Talk'});
});

router.get('/assets/:asset_title', (req, res) => {
  return res.render('article', {title: req.params.asset_title.split('-').join(' ')});
});

module.exports = router;
