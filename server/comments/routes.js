/* Api comment routes define the handlers for incoming comment related requests. */

var express = require('express');
var router = express.Router();

var Comment = require('./model');

router.use(function (req, res, next) {
	console.log("Read the cookie to make sure users can do this thing with comments.")
	next();
});


// Upsert a comment. Does this belong on the model?  In a "controller"?
var upsert = function (req, res) {

	// Get the data from the body.
	var data = req.body;

	// For creates, set the userid as the author.

	// Updates, ensure that the user is the author.

	// Strip protected fields (status)

	// For creates, set initial status.


	var comment = new Comment(data);

	comment.save(function (err) {
		if (err) {
			res.send('boom');
		} else {
			res.send(data);
		}
	})

}


router.get('/', function(req, res) {
	res.send('Read all of the comments ever');
});

router.get('/:commentId', function(req, res) {
	res.send('Read a comment');
});

router.post('/', upsert);
router.put('/', upsert);

router.delete('/:commentId', function(req, res) {
	res.send('Delete a comment');
});

module.exports = router;