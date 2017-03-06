const express = require('express');
const authorization = require('../../middleware/authorization');
const pkg = require('../../package.json');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({version: pkg.version});
});

router.use('/assets', authorization.needed('ADMIN'), require('./assets'));
router.use('/settings', authorization.needed('ADMIN'), require('./settings'));
router.use('/auth', require('./auth'));
router.use('/users', require('./users'));
router.use('/account', require('./account'));
router.use('/setup', require('./setup'));

// Bind the kue handler to the /kue path.
router.use('/kue', authorization.needed('ADMIN'), require('../../services/kue').kue.app);

module.exports = router;
