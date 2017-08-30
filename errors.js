/**
 * ExtendableError provides a base Error class to source off of that does not
 * break the inheritence chain.
 */
class ExtendableError {
  constructor(message = null) {
    this.message = message;
    this.stack = (new Error(message)).stack;
  }
}

/**
 * APIError is the base error that all application issued errors originate, they
 * are composed of data used by the front end and backend to handle errors
 * consistently.
 */
class APIError extends ExtendableError {
  constructor(message, {status = 500, translation_key = null}, metadata = {}) {
    super(message);

    this.status = status;
    this.translation_key = translation_key;
    this.metadata = metadata;
  }

  toJSON() {
    return {
      message: this.message,
      status: this.status,
      translation_key: this.translation_key,
      metadata: this.metadata
    };
  }
}

// ErrPasswordTooShort is returned when the password length is too short.
const ErrPasswordTooShort = new APIError('password must be at least 8 characters', {
  status: 400,
  translation_key: 'PASSWORD_LENGTH'
});

const ErrMissingEmail = new APIError('email is required', {
  translation_key: 'EMAIL_REQUIRED',
  status: 400
});

const ErrMissingPassword = new APIError('password is required', {
  translation_key: 'PASSWORD_REQUIRED',
  status: 400
});

const ErrEmailTaken = new APIError('Email address already in use', {
  translation_key: 'EMAIL_IN_USE',
  status: 400
});

const ErrUsernameTaken = new APIError('Username already in use', {
  translation_key: 'USERNAME_IN_USE',
  status: 400
});

const ErrSpecialChars = new APIError('No special characters are allowed in a username', {
  translation_key: 'NO_SPECIAL_CHARACTERS',
  status: 400
});

const ErrMissingUsername = new APIError('A username is required to create a user', {
  translation_key: 'USERNAME_REQUIRED',
  status: 400
});

// ErrMissingToken is returned in the event that the password reset is requested
// without a token.
const ErrMissingToken = new APIError('token is required', {
  status: 400
});

// ErrAssetCommentingClosed is returned when a comment or action is attempted on
// a stream where commenting has been closed.
class ErrAssetCommentingClosed extends APIError {
  constructor(closedMessage = null) {
    super('asset commenting is closed', {
      status: 400,
      translation_key: 'COMMENTING_CLOSED'
    }, {

      // Include the closedMessage in the metadata piece of the error.
      closedMessage
    });
  }
}

/**
 * ErrAuthentication is returned when there is an error authenticating and the
 * message is provided.
 */
class ErrAuthentication extends APIError {
  constructor(message = null) {
    super('authentication error occured', {
      status: 401
    }, {
      message
    });
  }
}

/**
 * ErrAlreadyExists is returned when an attempt to create a resource failed due to an existing one.
 */
class ErrAlreadyExists extends APIError {
  constructor(existing = null) {
    super('resource already exists', {
      translation_key: 'ALREADY_EXISTS',
      status: 409
    }, {
      existing
    });
  }
}

// ErrContainsProfanity is returned in the event that the middleware detects
// profanity/wordlisted words in the payload.
const ErrContainsProfanity = new APIError('This username contains elements which are not permitted in our community. If you think this is in error, please contact us or try again.', {
  translation_key: 'PROFANITY_ERROR',
  status: 400
});

const ErrNotFound = new APIError('not found', {
  translation_key: 'NOT_FOUND',
  status: 404
});

const ErrInvalidAssetURL = new APIError('asset_url is invalid', {
  translation_key: 'INVALID_ASSET_URL',
  status: 400
});

// ErrNotAuthorized is an error that is returned in the event an operation is
// deemed not authorized.
const ErrNotAuthorized = new APIError('not authorized', {
  translation_key: 'NOT_AUTHORIZED',
  status: 401
});

// ErrSettingsNotInit is returned when the settings are required but not
// initialized.
const ErrSettingsNotInit = new Error('settings not initialized, run `./bin/cli setup` to setup the application first');

// ErrSettingsInit is returned when the setup endpoint is hit and we are already
// initialized.
const ErrSettingsInit = new APIError('settings are already initialized', {
  status: 500
});

// ErrInstallLock is returned when the setup endpoint is hit and the install
// lock is present.
const ErrInstallLock = new APIError('install lock active', {
  status: 500
});

// ErrPermissionUpdateUsername is returned when the user does not have permission to update their username.
const ErrPermissionUpdateUsername = new APIError('You do not have permission to update your username.', {
  translation_key: 'EDIT_USERNAME_NOT_AUTHORIZED',
  status: 403
});

// ErrSameUsernameProvided is returned when attempting to update a username to the same username.
const ErrSameUsernameProvided = new APIError('Same username provided.', {
  translation_key: 'SAME_USERNAME_PROVIDED',
  status: 400
});

// ErrLoginAttemptMaximumExceeded is returned when the login maximum is exceeded.
const ErrLoginAttemptMaximumExceeded = new APIError('You have made too many incorrect password attempts.', {
  translation_key: 'LOGIN_MAXIMUM_EXCEEDED',
  status: 429
});

// ErrEditWindowHasEnded is returned when the edit window has expired.
const ErrEditWindowHasEnded = new APIError('Edit window is over', {
  translation_key: 'EDIT_WINDOW_ENDED',
  status: 403
});

// ErrCommentTooShort is returned when the comment is too short.
const ErrCommentTooShort = new APIError('Comment was too short', {
  translation_key: 'COMMENT_TOO_SHORT',
  status: 400
});

// ErrAssetURLAlreadyExists is returned when a rename operation is requested
// but an asset already exists with the new url.
const ErrAssetURLAlreadyExists = new APIError('Asset URL already exists, cannot rename', {
  translation_key: 'ASSET_URL_ALREADY_EXISTS',
  status: 409
});

module.exports = {
  ExtendableError,
  APIError,
  ErrAlreadyExists,
  ErrPasswordTooShort,
  ErrSettingsNotInit,
  ErrMissingEmail,
  ErrMissingPassword,
  ErrMissingToken,
  ErrEmailTaken,
  ErrSpecialChars,
  ErrMissingUsername,
  ErrContainsProfanity,
  ErrUsernameTaken,
  ErrAssetCommentingClosed,
  ErrNotFound,
  ErrInvalidAssetURL,
  ErrAuthentication,
  ErrNotAuthorized,
  ErrPermissionUpdateUsername,
  ErrSameUsernameProvided,
  ErrSettingsInit,
  ErrInstallLock,
  ErrLoginAttemptMaximumExceeded,
  ErrEditWindowHasEnded,
  ErrCommentTooShort,
  ErrAssetURLAlreadyExists
};
