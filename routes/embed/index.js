const express = require('express');
const router = express.Router();

router.use('/stream', (req, res) => {
  res.render('embed/stream');
});

router.use('/login', (req, res) => {
  res.render('embed/login');
});

module.exports = router;
