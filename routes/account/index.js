const express = require('express');
const router = express.Router();

router.get('/email/confirm', (req, res) => {
  res.render('account/email/confirm.njk');
});

router.get('/password/reset', (req, res) => {
  res.render('account/password/reset.njk');
});

module.exports = router;
