const express = require('express');
const router = express.Router();

router.use('/stream', (req, res) => {
  res.render('embed/stream.njk');
});

router.use('/amp', (req, res) => {
  res.render('embed/amp.njk');
});

module.exports = router;
