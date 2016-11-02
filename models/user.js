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
  name: {
    type: String,
    unique: true
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
},{
  _id: false
});

/**
 * Finds a user by the id.
 * @param {String} id  identifier of the user (uuid)
*/
UserSchema.methods.findById = function(id, done) {
  User.findOne({
    id : id
  }, (err, user) => {
    if (err) {
      return done(err);
    }

    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  });
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
