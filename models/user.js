'use strict';

const mongoose = require('../mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
