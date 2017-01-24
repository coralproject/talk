const express = require('express');
const authorization = require('../../middleware/authorization');

const router = express.Router();

router.use('/assets', authorization.needed('admin'), require('./assets'));
router.use('/settings', authorization.needed('admin'), require('./settings'));
router.use('/queue', authorization.needed('admin'), require('./queue'));

router.use('/comments', authorization.needed(), require('./comments'));
router.use('/actions', authorization.needed(), require('./actions'));

router.use('/auth', require('./auth'));
router.use('/users', require('./users'));
router.use('/account', require('./account'));

// Bind the kue handler to the /kue path.
router.use('/kue', authorization.needed('admin'), require('../../services/kue').kue.app);

module.exports = router;
