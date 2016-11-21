const express = require('express');

const router = express.Router();

router.use('/asset', require('./asset'));
router.use('/auth', require('./auth'));
router.use('/comments', require('./comments'));
router.use('/queue', require('./queue'));
router.use('/settings', require('./settings'));
router.use('/stream', require('./stream'));
router.use('/user', require('./user'));
router.use('/actions', require('./actions'));

module.exports = router;
