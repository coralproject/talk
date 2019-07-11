const express = require('express');
const { version } = require('../../../package.json');
const { REVISION_HASH } = require('../../../config');
const router = express.Router();

// Return the current version.
router.get('/', (req, res) => {
  res.json({ version, revision: REVISION_HASH });
});

router.use('/stories', require('./stories'));

module.exports = router;
