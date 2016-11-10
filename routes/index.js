const express = require('express');

const router = express.Router();

router.use('/api/v1', require('./api'));
router.use('/admin', require('./admin'));

router.use('/embed/:embed', (req, res, next) => {
  switch (req.params.embed) {
  case 'stream':
    return res.render('embed/stream', {});
  default:
    // will return a 404.
    return next();
  }
});

router.get('/', (req, res) => {
  return res.render('home', {});
});

module.exports = router;
