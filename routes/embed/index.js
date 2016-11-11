const express = require('express');
const router = express.Router();

router.use('/:embed', (req, res, next) => {
  switch (req.params.embed) {
  case 'stream':
    return res.render('embed/stream', {});
  default:
    // will return a 404.
    return next();
  }
});

module.exports = router;
