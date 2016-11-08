const express = require('express');

const router = express.Router();

router.get('*', (req, res) => {
  res.render('admin', {basePath: '/client/coral-admin'});
});

module.exports = router;
