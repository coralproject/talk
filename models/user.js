
const mongoose = require('../mongoose');
const uuid = require('uuid');
const Schema = mongoose.Schema;

const UserProfileSchema = new Schema({
  id: {
    type: String,
    default: uuid.v4,
    unique: true
  },
  display_name: String,
  auth_user_id: String
// },{
//   _id: false,
//   timestamps: {
//     createdAt: 'created_at',
//     updatedAt: 'updated_at'
//   }
});

/**
 * Finds a user by the id.
 * @param {String} id  identifier of the user (uuid)
*/
UserProfileSchema.statics.findById = function(id) {
  return UserProfile.findOne({id});
};

/**
 * Finds users in an array of idd.
 * @param {String} idd  array of user identifiers (uuid)
*/
UserProfileSchema.statics.findByIdArray = function(ids) {
  return UserProfile.find({
    'id': {$in: ids}
  });
};

// TO DO: methods
//    modifications to user as statics
//    find by auth user id

const UserProfile = mongoose.model('UserProfile', UserProfileSchema);

module.exports = UserProfile;
