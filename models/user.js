const mongoose = require('../mongoose');
const uuid = require('uuid');
const bcrypt = require('bcrypt');

// SALT_ROUNDS is the number of rounds that the bcrypt algorithm will run
// through during the salting process.
const SALT_ROUNDS = 10;

// USER_ROLES is the array of roles that is permissible as a user role.
const USER_ROLES = [
  'admin',
  'moderator'
];

// UserSchema is the mongoose schema defined as the representation of a User in
// MongoDB.
const UserSchema = new mongoose.Schema({

  // This ID represents the most unique identifier for a user, it is generated
  // when the user is created as a random uuid.
  id: {
    type: String,
    default: uuid.v4,
    unique: true,
    required: true
  },

  // This is sourced from the social provider or set manually during user setup
  // and simply provides a name to display for the given user.
  displayName: String,

  // This is true when the user account is disabled, no action should be
  // acknowledged when they are disabled. Logins are also prevented.
  disabled: Boolean,

  // This provides a source of identity proof for users who login using the
  // local provider. A local provider will be assumed for users who do not
  // have any social profiles.
  password: String,

  // Profiles describes the array of identities for a given user. Any one user
  // can have multiple profiles associated with them, including multiple email
  // addresses.
  profiles: [new mongoose.Schema({

    // ID provides the identifier for the user profile, in the case of a local
    // provider, the id would be an email, in the case of a social provider,
    // the id would be the foreign providers identifier.
    id: {
      type: String,
      required: true
    },

    // Provider is simply the name attached to the authentication mode. In the
    // case of a locally provided profile, this will simply be `local`, or a
    // social provider which for Facebook would just be `facebook`.
    provider: {
      type: String,
      required: true
    }
  }, {
    _id: false
  })],

  // Roles provides an array of roles (as strings) that is associated with a
  // user.
  roles: [String]
}, {

  // This will ensure that we have proper timestamps available on this model.
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Add the indixies on the user profile data.
UserSchema.index({
  'profiles.id': 1,
  'profiles.provider': 1
}, {
  unique: true,
  background: false
});

/**
 * toJSON overrides to remove the password field from the json
 * output.
 */
UserSchema.options.toJSON = {};
UserSchema.options.toJSON.hide = 'password profiles roles disabled';
UserSchema.options.toJSON.transform = (doc, ret, options) => {
  if (options.hide) {
    options.hide.split(' ').forEach((prop) => {
      delete ret[prop];
    });
  }

  return ret;
};

/**
 * toObject overrides to remove the password field from the toObject
 * output.
 */
UserSchema.options.toObject = {};
UserSchema.options.toObject.hide = 'password';
UserSchema.options.toObject.transform = (doc, ret, options) => {
  if (options.hide) {
    options.hide.split(' ').forEach((prop) => {
      delete ret[prop];
    });
  }

  return ret;
};

// Create the User model.
const UserModel = mongoose.model('User', UserSchema);

// UserService is the interface for the application to interact with the
// UserModel through.
const UserService = module.exports = {};

/**
 * Finds a user given their email address that we have for them in the system
 * and ensures that the retuned user matches the password passed in as well.
 * @param  {string}   email     - email to look up the user by
 * @param  {string}   password  - password to match against the found user
 * @param  {Function} done     [description]
 */
UserService.findLocalUser = (email, password) => {
  return UserModel.findOne({
    profiles: {
      $elemMatch: {
        id: email,
        provider: 'local'
      }
    }
  })
  .then((user) => {
    if (!user) {
      return false;
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (err) {
          return reject(err);
        }

        if (!res) {
          return resolve(false);
        }

        return resolve(user);
      });
    });
  });
};

/**
 * Merges two users together by taking all the profiles on a given user and
 * pushing them into the source user followed by deleting the destination user's
 * user account. This will not merge the roles associated with the source user.
 * @param  {String} dstUserID id of the user to which is the target of the merge
 * @param  {String} srcUserID id of the user to which is the source of the merge
 * @return {Promise}          resolves when the users are merged
 */
UserService.mergeUsers = (dstUserID, srcUserID) => {
  let srcUser, dstUser;

  return Promise
    .all([
      UserModel.findOne({id: dstUserID}).exec(),
      UserModel.findOne({id: srcUserID}).exec()
    ])
    .then((users) => {
      dstUser = users[0];
      srcUser = users[1];

      srcUser.profiles.forEach((profile) => {
        dstUser.profiles.push(profile);
      });

      return srcUser.remove();
    })
    .then(() => dstUser.save());
};

/**
 * Finds a user given a social profile and if the user does not exist, creates
 * them.
 * @param  {Object}   profile - User social/external profile
 * @param  {Function} done    [description]
 */
UserService.findOrCreateExternalUser = (profile) => {
  return UserModel
    .findOne({
      profiles: {
        $elemMatch: {
          id: profile.id,
          provider: profile.provider
        }
      }
    })
    .then((user) => {
      if (user) {
        return user;
      }

      // The user was not found, lets create them!
      user = new UserModel({
        displayName: profile.displayName,
        roles: [],
        profiles: [
          {
            id: profile.id,
            provider: profile.provider
          }
        ]
      });

      return user.save();
    });
};

UserService.changePassword = (id, password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, SALT_ROUNDS, (err, hashedPassword) => {
      if (err) {
        return reject(err);
      }

      resolve(hashedPassword);
    });
  })
  .then((hashedPassword) => {
    return UserModel.update({id}, {
      $set: {
        password: hashedPassword
      }
    });
  });
};

/**
 * Creates local users.
 * @param  {Array} users Users to create
 * @return {Promise}     Resolves with the users that were created
 */
UserService.createLocalUsers = (users) => {
  return Promise.all(users.map((user) => {
    return UserService
      .createLocalUser(user.email, user.password, user.displayName);
  }));
};

/**
 * Creates the local user with a given email, password, and name.
 * @param  {String}   email       email of the new user
 * @param  {String}   password    plaintext password of the new user
 * @param  {String}   displayName name of the display user
 * @param  {Function} done        callback
 */
UserService.createLocalUser = (email, password, displayName) => {
  if (!email) {
    return Promise.reject('email is required');
  }

  if (!password) {
    return Promise.reject('password is required');
  }

  if (!displayName) {
    return Promise.reject('displayName is required');
  }

  return new Promise((resolve, reject) => {
    bcrypt.hash(password, SALT_ROUNDS, (err, hashedPassword) => {
      if (err) {
        return reject(err);
      }

      let user = new UserModel({
        displayName: displayName,
        password: hashedPassword,
        roles: [],
        profiles: [
          {
            id: email,
            provider: 'local'
          }
        ]
      });

      user.save((err) => {
        if (err) {
          return reject(err);
        }

        return resolve(user);
      });
    });
  });
};

/**
 * Disables a given user account.
 * @param  {String}   id   id of a user
 * @param  {Function} done callback after the operation is complete
 */
UserService.disableUser = (id) => {
  return UserModel.update({
    id: id
  }, {
    $set: {
      disabled: true
    }
  });
};

/**
 * Enables a given user account.
 * @param  {String}   id   id of a user
 * @param  {Function} done callback after the operation is complete
 */
UserService.enableUser = (id) => {
  return UserModel.update({
    id: id
  }, {
    $set: {
      disabled: false
    }
  });
};

/**
 * Adds a role to a user.
 * @param  {String}   id   id of a user
 * @param  {String}   role role to add
 * @param  {Function} done callback after the operation is complete
 */
UserService.addRoleToUser = (id, role) => {

  // Check to see if the user role is in the allowable set of roles.
  if (USER_ROLES.indexOf(role) === -1) {

    // User role is not supported! Error out here.
    return Promise.reject(new Error(`role ${role} is not supported`));
  }

  return UserModel.update({
    id: id
  }, {
    $addToSet: {
      roles: role
    }
  });
};

/**
 * Removes a role from a user.
 * @param  {String}   id   id of a user
 * @param  {String}   role role to remove
 * @param  {Function} done callback after the operation is complete
 */
UserService.removeRoleFromUser = (id, role) => {
  return UserModel.update({
    id: id
  }, {
    $pull: {
      roles: role
    }
  });
};

/**
 * Finds a user with the id.
 * @param {String} id  user id (uuid)
*/
UserService.findById = (id) => {
  return UserModel.findOne({id});
};

/**
 * Finds users in an array of idd.
 * @param {Array} ids  array of user identifiers (uuid)
*/
UserService.findByIdArray = (ids) => {
  return UserModel.find({
    'id': {$in: ids}
  });
};

/**
 * Finds a user using a value which gets compared using a prefix match against
 * the user's email address and/or their display name.
 * @param  {String} value value to search by
 * @return {Promise}
 */
UserService.search = (value) => {
  return UserModel.find({
    $or: [

      // Search by a prefix match on the displayName.
      {
        'displayName': {
          $regex: new RegExp(`^${value}`),
          $options: 'i'
        }
      },

      // Search by a prefix match on the email address.
      {
        'profiles': {
          $elemMatch: {
            id: {
              $regex: new RegExp(`^${value}`),
              $options: 'i'
            },
            provider: 'local'
          }
        }
      }
    ]
  });
};

/**
 * Finds users by email and returns the count. The result should be 1 or 0 (bool) indicating email availability
 * @param  {String} email to search by
 * @return {Promise}
 */
UserService.availabilityCheck = (email) => {
  return UserModel.count({
    profiles: {
      $elemMatch: {
        id: email,
        provider: 'local'
      }
    }
  });
};

