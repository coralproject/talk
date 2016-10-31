/* Talk Comment model */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define the comment schema definition.
var commentSchema = new Schema({

	body: String,
	user: {type: String, index: true},
	context: {type: [String], index: true},

	status: {type: String, index: true}

}, {
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	}
});

// Create a comment model.
var Comment = mongoose.model('Comment', commentSchema); 


// Export the comment model.
module.exports = Comment
