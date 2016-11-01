'use strict';

const mongoose = require('../mongoose');
const uuid = require('uuid');
const Schema = mongoose.Schema;
const UserSchema = require('./user').Schema;
const AssetSchema = require('./asset').Schema;

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
  asset: AssetSchema,
  author: UserSchema,
  actions: {
    flags: [UserSchema],
    likes: [UserSchema]
  },
  status: {
    type: String,
    enum: ['accepted', 'rejected', 'untouched'],
    default: 'untouched'
  },
  parent: Comment,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
},{
  _id: false
});

/**
 * Finds a user by the id.
 * @param {String} id  identifier of the user (uuid)
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
