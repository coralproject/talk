const express = require('express');
const router = express.Router();

router.use('/api/v1', require('./api'));
router.use('/admin', require('./admin'));
router.use('/embed', require('./embed'));

router.get('/', (req, res) => {
  return res.render('home', {});
});

module.exports = router;
