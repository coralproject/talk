import mongoose from 'mongoose';
import bluebird from 'bluebird';
mongoose.Promise = bluebird;

const commentSchema = new mongoose.Schema({
	_id: {type: String, required: true, unique: true},
	name: { type: String }
});

commentSchema.statics = {
	list: (query = {}) => {
		return this.find({}).exec();
	},
	get: (id) => {
		return this.findOne({ _id: id }).exec();
	},
	add: (item) => {
		return item.save();
	},
	del: (id) => {
		return this.findByIdAndRemove(id);
	},
	edit: function (id, attributes) {
		return this.findOneAndUpdate({ _id: id }, attributes);
	}
};

commentSchema.methods = {
};

export default mongoose.model('Comment', commentSchema);
