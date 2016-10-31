/* Api comment routes define the handlers for incoming comment related requests. */

var express = require('express');
var router = express.Router();

router.use(function (req, res, next) {
	console.log("Read the cookie to make sure users can do this thing with comments.")
	next();
});


router.get('/', function(req, res) {
	res.send('Read all of the comments ever');
});

router.get('/:commentId', function(req, res) {
	res.send('Read a comment');
});

router.post('/', function(req, res) {
	res.send('Write a comment');
});

router.put('/:commentId', function(req, res) {
	res.send('Update a comment');
});

router.delete('/:commentId', function(req, res) {
	res.send('Delete a comment');
});

module.exports = router;
