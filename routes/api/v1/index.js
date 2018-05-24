const express = require('express');
const { version } = require('../../../package.json');
const { REVISION_HASH } = require('../../../config');
const router = express.Router();

// Return the current version.
router.get('/', (req, res) => {
  res.json({ version, revision: REVISION_HASH });
});

router.use('/account', require('./account'));
router.use('/csp', require('./csp'));
router.use('/assets', require('./assets'));
router.use('/auth', require('./auth'));
router.use('/graph', require('./graph'));
router.use('/setup', require('./setup'));
router.use('/users', require('./users'));

module.exports = router;
