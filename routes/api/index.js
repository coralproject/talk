const express = require('express');
const router = express.Router();

// Return the current version.
router.use('/v1', require('./v1'));
router.use('/v2', require('./v2'));

module.exports = router;
