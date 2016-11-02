'use strict';

const mongoose = require('../mongoose');
const uuid = require('uuid');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  id: {
    type: String,
    default: uuid.v4,
    unique: true
  },
  content: {
    type: String,
    required: [true, 'The content is required.'],
    minlenght: 50
  },
  asset: {
    type: Schema.Types.ObjectId,
    ref: 'Asset'
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  actions: {
    flags: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    likes: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  status: {
    type: String,
    enum: ['accepted', 'rejected', 'untouched'],
    default: 'untouched'
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
},{
  _id: false
});

/**
 * Finds a comment by the id.
 * @param {String} id  identifier of the comment (uuid)
*/
CommentSchema.methods.findById = function(id, done) {
  Comment.findOne({
    id : id
  }, (err, comment) => {
    if (err) {
      return done(err);
    }

    if (!comment) {
      return done(null, false);
    }
    return done(null, comment);
  });
};

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
