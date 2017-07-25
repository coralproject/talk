const mongoose = require('../services/mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const uuid = require('uuid');
const TagLinkSchema = require('./schema/tag_link');
const TokenSchema = require('./schema/token');
const intersection = require('lodash/intersection');
const can = require('../perms');

// USER_ROLES is the array of roles that is permissible as a user role.
const USER_ROLES = require('./enum/user_roles');

// USER_STATUS is the list of statuses that are permitted for the user status.
const USER_STATUS = require('./enum/user_status');

// ProfileSchema is the mongoose schema defined as the representation of a
// User's profile stored in MongoDB.
const ProfileSchema = new Schema({

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
  },

  // Metadata provides a place to put provider specific details. An example of
  // something that could be stored here is the `metadata.confirmed_at` could be
  // used by the `local` provider to indicate when the email address was
  // confirmed.
  metadata: {
    type: Schema.Types.Mixed
  }
}, {
  _id: false
});

// UserSchema is the mongoose schema defined as the representation of a User in
// MongoDB.
const UserSchema = new Schema({

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
  username: {
    type: String,
    required: true
  },

  // TODO: find a way that we can instead utilize MongoDB 3.4's collation
  // options to build the index in a case insenstive manner:
  // https://docs.mongodb.com/manual/reference/collation/
  lowercaseUsername: {
    type: String,
    required: true,
    unique: true
  },

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
  profiles: [ProfileSchema],

  // Tokens are the individual personal access tokens for a given user.
  tokens: [TokenSchema],

  // Roles provides an array of roles (as strings) that is associated with a
  // user.
  roles: [{
    type: String,
    enum: USER_ROLES
  }],

  // Status provides a string that says in which state the account is.
  // When the account is banned, the user login is disabled.
  status: {
    type: String,
    enum: USER_STATUS,
    default: 'ACTIVE'
  },

  // Determines whether the user can edit their username.
  canEditName: {
    type: Boolean,
    default: false
  },

  // User's suspension details.
  suspension: {
    until: {
      type: Date,
      default: null,
    },
  },

  // User's settings
  settings: {
    bio: {
      type: String,
      default: ''
    }
  },

  ignoresUsers: [{

    // user id of another user
    type: String,
  }],

  // Tags are added by the self or by administrators.
  tags: [TagLinkSchema],

  // Additional metadata stored on the field.
  metadata: {
    default: {},
    type: Object
  }
}, {

  // This will ensure that we have proper timestamps available on this model.
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },

  toJSON: {
    transform: function (doc, ret) {
      delete ret.password;
      delete ret._id;
      delete ret.__v;
    }
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
 * returns true if a commenter is staff
 */
UserSchema.method('isStaff', function () {
  return intersection(['ADMIN', 'MODERATOR', 'STAFF'], this.roles).length !== 0;
});

/**
 * This verifies that a password is valid.
 */
UserSchema.method('verifyPassword', function(password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, res) => {
      if (err) {
        return reject(err);
      }

      if (!res) {
        return resolve(false);
      }

      return resolve(true);
    });
  });
});

/**
 * Can returns true if the user is allowed to perform a specific graph
 * operation.
 */
UserSchema.method('can', function(...actions) {
  return can(this, ...actions);
});

// Create the User model.
const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
