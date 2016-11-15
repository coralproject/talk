const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/embed/stream/preview', (req, res) => {
  res.render('embed-stream', {basePath: '/client/embed/stream'});
});

router.get('/password-reset/:token', (req, res, next) => {
  jwt.verify(req.params.token, process.env.TALK_SESSION_SECRET, (error, decoded) => {
    if (error) {
      return res.status(400).json({error});
    }

    console.log(decoded);

    res.json(decoded);
  });
});

router.get('*', (req, res) => {
  res.render('admin', {basePath: '/client/coral-admin'});
});

module.exports = router;
