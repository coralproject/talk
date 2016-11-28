const express = require('express');
const authorization = require('../../middleware/authorization');

const router = express.Router();

router.use('/asset', authorization.needed('admin'), require('./asset'));
router.use('/settings', authorization.needed('admin'), require('./settings'));
router.use('/queue', authorization.needed('admin'), require('./queue'));

router.use('/comments', authorization.needed(), require('./comments'));
router.use('/actions', authorization.needed(), require('./actions'));

router.use('/auth', require('./auth'));
router.use('/stream', require('./stream'));
router.use('/user', require('./user'));

// Bind the kue handler to the /kue path.
router.use('/kue', authorization.needed('admin'), require('kue').app);

module.exports = router;
