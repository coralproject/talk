const express = require('express');
const pkg = require('../../../package.json');
const router = express.Router();

// Return the current version.
router.get('/', (req, res) => {
  res.json({ version: pkg.version });
});

router.use('/account', require('./account'));
router.use('/assets', require('./assets'));
router.use('/auth', require('./auth'));
router.use('/graph', require('./graph'));
router.use('/setup', require('./setup'));
router.use('/users', require('./users'));

module.exports = router;
