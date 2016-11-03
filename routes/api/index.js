const express = require('express');

const router = express.Router();

router.use('/comments', require('./comments'));
router.use('/settings', require('./settings'));
router.use('/queue', require('./queue'));

module.exports = router;
