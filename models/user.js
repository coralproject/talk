const mongoose = require('../services/mongoose');
const uuid = require('uuid');

// USER_ROLES is the array of roles that is permissible as a user role.
const USER_ROLES = [
  'ADMIN',
  'MODERATOR'
];

// USER_STATUS is the list of statuses that are permitted for the user status.
const USER_STATUS = [
  'ACTIVE',
  'BANNED',
  'PENDING',
  'SUSPENDED',
];

// ProfileSchema is the mongoose schema defined as the representation of a
// User's profile stored in MongoDB.
const ProfileSchema = new mongoose.Schema({

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
    type: mongoose.Schema.Types.Mixed
  }
}, {
  _id: false
});

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
  displayName: {
    type: String,
    unique: true,
    required: true
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

  // User's settings
  settings: {
    bio: {
      type: String,
      default: ''
    }
  }
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
 * Returns true if the user has all the roles specified.
 */
UserSchema.method('hasRoles', function(...roles) {
  return roles.every((role) => {

    // TODO: remove toUpperCase() once we've migrated usage.
    return this.roles.indexOf(role.toUpperCase()) >= 0;
  });
});

/**
 * All the graph operations that are available for a user.
 * @type {Array}
 */
const USER_GRAPH_OPERATIONS = [
  'mutation:createComment',
  'mutation:createAction',
  'mutation:deleteAction',
  'mutation:editName'
];

/**
 * Can returns true if the user is allowed to perform a specific graph
 * operation.
 */
UserSchema.method('can', function(...actions) {
  if (actions.some((action) => USER_GRAPH_OPERATIONS.indexOf(action) === -1)) {
    throw new Error(`invalid actions: ${actions}`);
  }

  if (this.status === 'BANNED') {
    return false;
  }

  return true;
});

// Create the User model.
const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
module.exports.USER_ROLES = USER_ROLES;
module.exports.USER_STATUS = USER_STATUS;
