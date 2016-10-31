/* API routes contains general api funcitonality. */

var express = require('express');
var router = express.Router();

router.use(function auth(req, res, next) {
	console.log('Read the user cookie here.');
	next();
});

// Base route provides server version information.
router.get('/', function(req, res) {
	res.send('App version information goes here....');
});

module.exports = router;
