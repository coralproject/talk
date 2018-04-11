const express = require('express');
const router = express.Router();

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
