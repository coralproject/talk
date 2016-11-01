'use strict';

const mongoose = require('../mongoose');
const uuid = require('uuid');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  id: {
    type: String,
    default: uuid.v4,
    unique: true
  },
  name: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
},{
  _id: false
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
module.exports.Schema = UserSchema;
