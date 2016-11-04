const mongoose = require('../mongoose');
const uuid = require('uuid');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  id: {
    type: String,
    default: uuid.v4,
    unique: true
  },
  body: {
    type: String,
    required: [true, 'The body is required.'],
    minlength: 10
  },
  asset_id: String,
  author_id: String,
  status: {
    type: String,
    enum: ['accepted', 'rejected', ''],
    default: ''
  },
  parent_id: String
},{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

/**
 * Finds a comment by the id.
 * @param {String} id  identifier of the comment (uuid)
*/
CommentSchema.statics.findById = function(id) {
  return Comment.findOne({id});
};

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
