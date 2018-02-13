const express = require('express');
const router = express.Router();

if (process.env.NODE_ENV !== 'production') {
  router.get('/docs', (req, res) => {
    res.render('admin/docs');
  });
}

router.get('/confirm-email', (req, res) => {
  res.render('admin/confirm-email');
});

router.get('/password-reset', (req, res) => {
  res.render('admin/password-reset');
});

router.get('*', (req, res) => {
  res.render('admin');
});

module.exports = router;
