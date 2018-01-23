const express = require('express');
const pkg = require('../../package.json');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ version: pkg.version });
});

router.use('/assets', require('./assets'));
router.use('/settings', require('./settings'));
router.use('/auth', require('./auth'));
router.use('/users', require('./users'));
router.use('/account', require('./account'));
router.use('/setup', require('./setup'));

module.exports = router;
