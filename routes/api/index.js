const express = require('express');
const authorization = require('../../middleware/authorization');

const router = express.Router();

router.use('/asset', require('./asset'));
router.use('/auth', require('./auth'));
router.use('/comments', authorization.needed(), require('./comments'));
router.use('/queue', require('./queue'));
router.use('/settings', authorization.needed('admin'), require('./settings'));
router.use('/stream', require('./stream'));
router.use('/user', require('./user'));
router.use('/actions', authorization.needed(), require('./actions'));

module.exports = router;
