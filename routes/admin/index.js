const express = require('express');
const router = express.Router();

router.get('/embed/stream/preview', (req, res) => {
  res.render('embed-stream', {basePath: '/client/embed/stream'});
});

// this route is expecting there to be a token in the hash
// see /views/password-reset-email.ejs
router.get('/password-reset', (req, res, next) => {
  // TODO: store the redirect uri in the token or something fancy
  // admins and regular users should probably be redirected to different places.
  res.render('password-reset', {redirectUri: process.env.TALK_ROOT_URL});
});

router.get('*', (req, res) => {
  res.render('admin', {basePath: '/client/coral-admin'});
});

module.exports = router;
