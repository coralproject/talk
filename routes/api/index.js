const express = require('express');
const router = express.Router();

// Return the current version.
router.use('/v1', require('./v1'));

module.exports = router;
