/**
 * ExtendableError provides a base Error class to source off of that does not
 * break the inheritence chain.
 */
class ExtendableError {
  constructor(message = null) {
    this.message = message;
    this.stack = (new Error()).stack;
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

const ErrDisplayTaken = new APIError('Display name already in use', {
  translation_key: 'DISPLAYNAME_IN_USE',
  status: 400
});

const ErrSpecialChars = new APIError('No special characters are allowed in a display name', {
  translation_key: 'NO_SPECIAL_CHARACTERS',
  status: 400
});

const ErrMissingDisplay = new APIError('A display name is required to create a user', {
  translation_key: 'DISPLAY_NAME_REQUIRED',
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
      status: 400
    }, {

      // Include the closedMessage in the metadata piece of the error.
      closedMessage
    });
  }
}

// ErrContainsProfanity is returned in the event that the middleware detects
// profanity/wordlisted words in the payload.
const ErrContainsProfanity = new APIError('Suspected profanity. If you think this in error, please let us know!', {
  translation_key: 'PROFANITY_ERROR',
  status: 400
});

const ErrNotFound = new APIError('not found', {
  status: 404
});

const ErrInvalidAssetURL = new APIError('asset_url is invalid', {
  status: 400
});

// ErrNotAuthorized is an error that is returned in the event an operation is
// deemed not authorized.
const ErrNotAuthorized = new APIError('not authorized', {
  status: 401
});

module.exports = {
  ExtendableError,
  APIError,
  ErrPasswordTooShort,
  ErrMissingEmail,
  ErrMissingPassword,
  ErrMissingToken,
  ErrEmailTaken,
  ErrSpecialChars,
  ErrMissingDisplay,
  ErrContainsProfanity,
  ErrDisplayTaken,
  ErrAssetCommentingClosed,
  ErrNotFound,
  ErrInvalidAssetURL,
  ErrNotAuthorized
};
