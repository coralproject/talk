const express = require('express');
const router = express.Router();

router.use('/api/v1', require('./api'));
router.use('/admin', require('./admin'));
router.use('/embed', require('./embed'));
router.use('/assets', require('./assets'));

router.get('/', (req, res) => {
  return res.render('article', {
    title: 'Coral Talk',
    basePath: '/client/embed/stream'
  });
});

module.exports = router;
