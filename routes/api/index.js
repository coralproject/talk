const express = require('express');
const authorization = require('../../middleware/authorization');

const router = express.Router();

router.use('/assets', authorization.needed('ADMIN'), require('./assets'));
router.use('/settings', authorization.needed('ADMIN'), require('./settings'));
router.use('/queue', authorization.needed('ADMIN'), require('./queue'));

router.use('/comments', authorization.needed(), require('./comments'));
router.use('/actions', authorization.needed(), require('./actions'));

router.use('/auth', require('./auth'));
router.use('/users', require('./users'));
router.use('/account', require('./account'));
router.use('/setup', require('./setup'));

// Bind the kue handler to the /kue path.
router.use('/kue', authorization.needed('ADMIN'), require('../../services/kue').kue.app);

module.exports = router;
