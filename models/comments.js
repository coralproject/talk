'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('user');
var Asset = require('asset');

var commentSchema = new Schema({
  content: {
    type: String,
    required: [true, 'The content is required.'],
    minlenght: 50
  },
  asset: Asset,
  author: User,
  actions: {
    flags: [User],
    likes: [User]
  },
  status: {
    type: String,
    enum: ['accepted', 'rejected', 'untouched'],
    default: 'untouched'
  },
  parent: Comment,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
