const express = require('express');

const router = express.Router();

router.use('/comments', require('./comments'));
router.use('/queue', require('./queue'));

module.exports = router;
