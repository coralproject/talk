const express = require('express');
const router = express.Router();

// GET /password-reset expects an OpenID token in the hash.
// Links to this endpoit are generated in /views/password-reset-email.ejs.
router.get('/password-reset', (req, res, next) => {
  // TODO: store the redirect uri in the token or something fancy
  // admins and regular users should probably be redirected to different places.
  res.render('password-reset', {redirectUri: process.env.TALK_ROOT_URL});
});

router.get('*', (req, res) => {
  res.render('admin', {basePath: '/client/coral-admin'});
});

module.exports = router;
