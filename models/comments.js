'use strict';

const mongoose = require('../mongoose');
const Schema = mongoose.Schema;
const User = require('user');
const Asset = require('asset');

const commentSchema = new Schema({
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

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
