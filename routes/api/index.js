const express = require('express');
const authorization = require('../../middleware/authorization');
const payloadFilter = require('../../middleware/payload-filter');

const router = express.Router();

// Filter all content going down the pipe based on user roles.
router.use(payloadFilter);

router.use('/asset', authorization.needed('admin'), require('./asset'));
router.use('/settings', authorization.needed('admin'), require('./settings'));
router.use('/queue', authorization.needed('admin'), require('./queue'));

router.use('/comments', authorization.needed(), require('./comments'));
router.use('/actions', authorization.needed(), require('./actions'));

router.use('/auth', require('./auth'));
router.use('/stream', require('./stream'));
router.use('/users', require('./users'));

// Bind the kue handler to the /kue path.
router.use('/kue', authorization.needed('admin'), require('../../services/kue').kue.app);

module.exports = router;
