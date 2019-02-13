const mongoose = require('../../services/mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const uuid = require('uuid');
const TagLink = require('./tag_link');
const Token = require('./token');
const can = require('../../perms');
const { get } = require('lodash');

// USER_ROLES is the array of roles that is permissible as a user role.
const USER_ROLES = require('../enum/user_roles');

// USER_STATUS_USERNAME is the list of statuses that are supported by storing
// the username state.
const USER_STATUS_USERNAME = require('../enum/user_status_username');

// Profile is the mongoose schema defined as the representation of a
// User's profile stored in MongoDB.
const Profile = new Schema(
  {
    // ID provides the identifier for the user profile, in the case of a local
    // provider, the id would be an email, in the case of a social provider,
    // the id would be the foreign providers identifier.
    id: {
      type: String,
      required: true,
    },

    // Provider is simply the name attached to the authentication mode. In the
    // case of a locally provided profile, this will simply be `local`, or a
    // social provider which for Facebook would just be `facebook`.
    provider: {
      type: String,
      required: true,
    },

    // Metadata provides a place to put provider specific details. An example of
    // something that could be stored here is the `metadata.confirmed_at` could be
    // used by the `local` provider to indicate when the email address was
    // confirmed.
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    _id: false,
  }
);

// User is the mongoose schema defined as the representation of a User in
// MongoDB.
const User = new Schema(
  {
    // This ID represents the most unique identifier for a user, it is generated
    // when the user is created as a random uuid.
    id: {
      type: String,
      default: uuid.v4,
      unique: true,
      required: true,
      index: true,
    },

    // This is sourced from the social provider or set manually during user setup
    // and simply provides a name to display for the given user.
    username: {
      type: String,
      required: true,
    },

    // TODO: find a way that we can instead utilize MongoDB 3.4's collation
    // options to build the index in a case insenstive manner:
    // https://docs.mongodb.com/manual/reference/collation/
    lowercaseUsername: {
      type: String,
      required: true,
      unique: true,
    },

    // This provides a source of identity proof for users who login using the
    // local provider. A local provider will be assumed for users who do not
    // have any social profiles.
    password: String,

    // Profiles describes the array of identities for a given user. Any one user
    // can have multiple profiles associated with them, including multiple email
    // addresses.
    profiles: [Profile],

    // Tokens are the individual personal access tokens for a given user.
    tokens: [Token],

    // Role is the specific user role that the user holds.
    role: {
      type: String,
      enum: USER_ROLES,
      required: true,
      default: 'COMMENTER',
    },

    // Status stores the user status information regarding permissions,
    // capabilities and moderation state.
    status: {
      // Username stores the current user status for the username as well as the
      // history of changes.
      username: {
        // Status stores the current username status.
        status: {
          type: String,
          enum: USER_STATUS_USERNAME,
          index: true,
        },

        // History stores the history of username status changes.
        history: [
          {
            // Status stores the historical username status.
            status: {
              type: String,
              enum: USER_STATUS_USERNAME,
            },

            // assigned_by stores the user id of the user who assigned this status.
            assigned_by: { type: String, default: null },

            // created_at stores the date when this status was assigned.
            created_at: { type: Date, default: Date.now },
          },
        ],
      },

      // Banned stores the current user banned status as well as the history of
      // changes.
      banned: {
        // Status stores the current user banned status.
        status: {
          type: Boolean,
          required: true,
          default: false,
          index: true,
        },
        history: [
          {
            // Status stores the historical banned status.
            status: Boolean,

            // assigned_by stores the user id of the user who assigned this status.
            assigned_by: { type: String, default: null },

            // message stores the email content sent to the user.
            message: { type: String, default: null },

            // created_at stores the date when this status was assigned.
            created_at: { type: Date, default: Date.now },
          },
        ],
      },

      // Suspension stores the current user suspension status as well as the
      // history of changes.
      suspension: {
        // until is the date that the user is suspended until.
        until: {
          type: Date,
          default: null,
        },
        history: [
          {
            // until is the date that the user is suspended until.
            until: Date,

            // assigned_by stores the user id of the user who assigned this status.
            assigned_by: { type: String, default: null },

            // message stores the email content sent to the user.
            message: { type: String, default: null },

            // created_at stores the date when this status was assigned.
            created_at: { type: Date, default: Date.now },
          },
        ],
      },

      // alwaysPremod stores the current user premod status as well as the history of
      // changes.
      alwaysPremod: {
        // Status stores the current user premod status.
        status: {
          type: Boolean,
          required: true,
          default: false,
          index: true,
        },
        history: [
          {
            // Status stores the historical premod status.
            status: Boolean,

            // assigned_by stores the user id of the user who assigned this status.
            assigned_by: { type: String, default: null },

            // created_at stores the date when this status was assigned.
            created_at: { type: Date, default: Date.now },
          },
        ],
      },
    },

    // IgnoresUsers is an array of user id's that the current user is ignoring.
    ignoresUsers: [String],

    // Counts to store related to actions taken on the given user.
    action_counts: {
      default: {},
      type: Object,
    },

    // Tags are added by the self or by administrators.
    tags: [TagLink],

    // Additional metadata stored on the field.
    metadata: {
      default: {},
      type: Object,
    },
  },
  {
    // This will ensure that we have proper timestamps available on this model.
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },

    toJSON: {
      transform: function(doc, ret) {
        delete ret.__v;
        delete ret._id;
        delete ret.password;
      },
    },
  }
);

// Add the index on the user profile data.
User.index(
  {
    'profiles.id': 1,
    'profiles.provider': 1,
  },
  {
    unique: true,
    background: false,
  }
);

User.index({
  lowercaseUsername: 1,
  'profiles.id': 1,
  created_at: -1,
});

User.index(
  {
    'metadata.displayName': 1,
  },
  {
    sparse: true,
  }
);

// This query is executed often, to count the number of flagged accounts with
// usernames.
User.index({
  'action_counts.flag': 1,
  'status.username.status': 1,
});

// Sorting users by created at is the default people search.
User.index({
  created_at: -1,
});

/**
 * returns true if a commenter is staff.
 */
User.method('isStaff', function() {
  return this.role !== 'COMMENTER';
});

/**
 * This verifies that a password is valid.
 */
User.method('verifyPassword', function(password) {
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
User.method('can', function(...actions) {
  return can(this, ...actions);
});

/**
 * firstEmail will return the first email on the user.
 */
User.virtual('firstEmail').get(function() {
  const emails = this.emails;
  if (emails.length === 0) {
    return null;
  }

  return emails[0];
});

/**
 * emails will return all the emails on a user.
 */
User.virtual('emails').get(function() {
  return (this.profiles || [])
    .filter(({ provider }) => provider === 'local')
    .map(({ id }) => id);
});

/**
 * hasVerifiedEmail will return true if at least one of the local email accounts
 * have their email verified.
 */
User.virtual('hasVerifiedEmail').get(function() {
  return this.profiles
    .filter(({ provider }) => provider === 'local')
    .some(profile => {
      const confirmedAt = get(profile, 'metadata.confirmed_at') || null;

      // If the profile doesn't have a metadata field, or it does not have a
      // confirmed_at field, or that field is null, then send them back.
      return confirmedAt !== null;
    });
});

/**
 * system returns true when the user is a system user.
 */
User.virtual('system')
  .get(function() {
    return this._system;
  })
  .set(function(system) {
    this._system = system;
  });

/**
 * banned returns true when the user is currently banned, and sets the banned
 * status locally.
 */
User.virtual('banned')
  .get(function() {
    return this.status.banned.status;
  })
  .set(function(status) {
    this.status.banned.status = status;

    if (!this.status.banned.history) {
      this.status.banned.history = [];
    }

    this.status.banned.history.push({
      status,
      created_at: new Date(),
    });
  });

/**
 * alwaysPremod returns true when the user is currently in always premod, and sets the alwaysPremod
 * status locally.
 */
User.virtual('alwaysPremod')
  .get(function() {
    return this.status.alwaysPremod.status;
  })
  .set(function(status) {
    this.status.alwaysPremod.status = status;

    if (!this.status.alwaysPremod.history) {
      this.status.alwaysPremod.history = [];
    }

    this.status.alwaysPremod.history.push({
      status,
      created_at: new Date(),
    });
  });

/**
 * suspended returns true when the user is currently suspended, and sets the
 * suspension status locally.
 */
User.virtual('suspended')
  .get(function() {
    return Boolean(
      this.status.suspension.until && this.status.suspension.until > new Date()
    );
  })
  .set(function(until) {
    this.status.suspension.until = until;

    if (!this.status.suspension.history) {
      this.status.suspension.history = [];
    }

    this.status.suspension.history.push({
      until,
      created_at: new Date(),
    });
  });

module.exports = User;
