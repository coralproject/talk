const express = require('express');
const router = express.Router();

router.get('/embed/stream/preview', (req, res) => {
  res.render('embed-stream', {basePath: '/client/embed/stream'});
});

router.get('/password-reset/:token', (req, res, next) => {
  // render a page or something?
  res.send('ok');
});

router.get('*', (req, res) => {
  res.render('admin', {basePath: '/client/coral-admin'});
});

module.exports = router;
