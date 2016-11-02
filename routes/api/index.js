const express = require('express');

const router = express.Router();

router.use('/comments', require('./comments'));
router.use('/stream', require('./stream'));

module.exports = router;
