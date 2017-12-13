'use strict';

/**
 * Creates a new Coral Talk user from the provided JWT
 * if an existing user is not already found. Derives
 * user ID from the JWT's "sub" claim and username from
 * its "usn" claim. See the coral-talk Clay component
 * for JWT claim generation.
**/
const UserModel = require('../../models/user');

module.exports.tokenUserNotFound = ({jwt}) => {
  const id = jwt.sub,
    username = jwt.usn,
    email = jwt.eml;

  return UserModel.findOneAndUpdate({
    id
  }, {
    id,
    username,
    lowercaseUsername: username.toLowerCase(),
    roles: [],
    profiles: [{
      provider: 'nymag',
      id: email
    }]
  }, {
    setDefaultsOnInsert: true,
    new: true,
    upsert: true
  });
};
