const express = require('express');

const router = express.Router();

router.use('/comments', require('./comments'));
router.use('/stream', require('./stream'));
router.use('/settings', require('./settings'));
router.use('/queue', require('./queue'));

module.exports = router;
