import '../models/comment.model'
const Comment = mongoose.model('Comment');

module.exports = {
	list: (req, res) => {
		res.send('Read all of the comments ever');
	},
	get: (req, res) => {
		res.send('Read a comment');
	},
	add: (req, res) => {
		res.send('Write a comment');
	},
	edit: (req, res) => {
		res.send('modify a comment')
	},
	del: (req, res) => {
		res.send('Delete a comment');
	}
}
