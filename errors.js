/**
 * ExtendableError provides a base Error class to source off of that does not
 * break the inheritance chain.
 */
class ExtendableError {
  constructor(message = null) {
    this.message = message;
    this.stack = new Error(message).stack;
  }
}

/**
 * TalkError is the base error that all application issued errors originate,
 * they are composed of data used by the front end and backend to handle errors
 * consistently.
 */
class TalkError extends ExtendableError {
  constructor(
    message,
    { status = 500, translation_key = null } = {},
    metadata = {}
  ) {
    super(message);

    this.status = status || 500;
    this.translation_key = translation_key || null;
    this.metadata = metadata || {};
  }

  toJSON() {
    return {
      message: this.message,
      status: this.status,
      translation_key: this.translation_key,
      metadata: this.metadata,
    };
  }
}

// ErrPasswordTooShort is returned when the password length is too short.
class ErrPasswordTooShort extends TalkError {
  constructor() {
    super('password must be at least 8 characters', {
      status: 400,
      translation_key: 'PASSWORD_LENGTH',
    });
  }
}

class ErrMissingEmail extends TalkError {
  constructor() {
    super('email is required', {
      translation_key: 'EMAIL_REQUIRED',
      status: 400,
    });
  }
}

class ErrMissingPassword extends TalkError {
  constructor() {
    super('password is required', {
      translation_key: 'PASSWORD_REQUIRED',
      status: 400,
    });
  }
}

class ErrEmailTaken extends TalkError {
  constructor() {
    super('Email address already in use', {
      translation_key: 'EMAIL_IN_USE',
      status: 400,
    });
  }
}

class ErrUsernameTaken extends TalkError {
  constructor() {
    super('Username already in use', {
      translation_key: 'USERNAME_IN_USE',
      status: 400,
    });
  }
}

class ErrSameUsernameProvided extends TalkError {
  constructor() {
    super('Username provided for change is the same as current', {
      translation_key: 'SAME_USERNAME_PROVIDED',
      status: 400,
    });
  }
}

class ErrSpecialChars extends TalkError {
  constructor() {
    super('No special characters are allowed in a username', {
      translation_key: 'NO_SPECIAL_CHARACTERS',
      status: 400,
    });
  }
}

class ErrMissingUsername extends TalkError {
  constructor() {
    super('A username is required to create a user', {
      translation_key: 'USERNAME_REQUIRED',
      status: 400,
    });
  }
}

// ErrEmailVerificationToken is returned in the event that the password reset is requested
// without a token.
class ErrEmailVerificationToken extends TalkError {
  constructor() {
    super('token is required', {
      translation_key: 'EMAIL_VERIFICATION_TOKEN_INVALID',
      status: 400,
    });
  }
}

// ErrEmailAlreadyVerified is returned when the user tries to verify an email
// address that has already been verified.
class ErrEmailAlreadyVerified extends TalkError {
  constructor() {
    super('email address is already verified', {
      translation_key: 'EMAIL_ALREADY_VERIFIED',
      status: 409,
    });
  }
}

// ErrPasswordResetToken is returned in the event that the password reset is requested
// without a token.
class ErrPasswordResetToken extends TalkError {
  constructor() {
    super('token is required', {
      translation_key: 'PASSWORD_RESET_TOKEN_INVALID',
      status: 400,
    });
  }
}

// ErrAssetCommentingClosed is returned when a comment or action is attempted on
// a stream where commenting has been closed.
class ErrAssetCommentingClosed extends TalkError {
  constructor(closedMessage = null) {
    super(
      'asset commenting is closed',
      {
        status: 400,
        translation_key: 'COMMENTING_CLOSED',
      },
      {
        // Include the closedMessage in the metadata piece of the error.
        closedMessage,
      }
    );
  }
}

// ErrCommentingDisabled is returned when a comment or action is attempted while
// commenting has been disabled site-wide.
class ErrCommentingDisabled extends TalkError {
  constructor(message = null) {
    super(
      'asset commenting is closed',
      {
        status: 400,
        translation_key: 'COMMENTING_DISABLED',
      },
      {
        // Include the closedMessage in the metadata piece of the error.
        message,
      }
    );
  }
}

/**
 * ErrAuthentication is returned when there is an error authenticating and the
 * message is provided.
 */
class ErrAuthentication extends TalkError {
  constructor(message = null) {
    super(
      'authentication error occurred',
      {
        status: 401,
        translation_key: 'AUTHENTICATION',
      },
      {
        message,
      }
    );
  }
}

/**
 * ErrAlreadyExists is returned when an attempt to create a resource failed due to an existing one.
 */
class ErrAlreadyExists extends TalkError {
  constructor(existing = null) {
    super(
      'resource already exists',
      {
        translation_key: 'ALREADY_EXISTS',
        status: 409,
      },
      {
        existing,
      }
    );
  }
}

// ErrContainsProfanity is returned in the event that the middleware detects
// profanity/banned/suspect words in the payload.
class ErrContainsProfanity extends TalkError {
  constructor(phrase) {
    super(
      'This username contains elements which are not permitted in our community. If you think this is in error, please contact us or try again.',
      {
        translation_key: 'PROFANITY_ERROR',
        status: 400,
      },
      { phrase }
    );
  }
}

class ErrHTTPNotFound extends TalkError {
  constructor() {
    super('http not found', {
      translation_key: 'NOT_FOUND',
      status: 404,
    });
  }
}

class ErrNotFound extends TalkError {
  constructor() {
    super('not found', {
      translation_key: 'NOT_FOUND',
      status: 404,
    });
  }
}

class ErrInvalidAssetURL extends TalkError {
  constructor() {
    super('asset_url is invalid', {
      translation_key: 'INVALID_ASSET_URL',
      status: 400,
    });
  }
}

// ErrNotAuthorized is an error that is returned in the event an operation is
// deemed not authorized.
class ErrNotAuthorized extends TalkError {
  constructor() {
    super('not authorized', {
      translation_key: 'NOT_AUTHORIZED',
      status: 401,
    });
  }
}

// ErrSettingsNotInit is returned when the settings are required but not
// initialized.
class ErrSettingsNotInit extends TalkError {
  constructor() {
    super(
      'Talk is currently not setup. Please proceed to our web installer at $ROOT_URL/admin/install or run ./bin/cli-setup. Visit https://docs.coralproject.net/talk/ for more information on installation and configuration instructions'
    );
  }
}

// ErrSettingsInit is returned when the setup endpoint is hit and we are already
// initialized.
class ErrSettingsInit extends TalkError {
  constructor() {
    super('settings are already initialized', {
      status: 500,
    });
  }
}

// ErrInstallLock is returned when the setup endpoint is hit and the install
// lock is present.
class ErrInstallLock extends TalkError {
  constructor() {
    super('install lock active', {
      status: 500,
    });
  }
}

// ErrPermissionUpdateUsername is returned when the user does not have permission to update their username.
class ErrPermissionUpdateUsername extends TalkError {
  constructor() {
    super('You do not have permission to update your username.', {
      translation_key: 'EDIT_USERNAME_NOT_AUTHORIZED',
      status: 403,
    });
  }
}

// ErrLoginAttemptMaximumExceeded is returned when the login maximum is exceeded.
class ErrLoginAttemptMaximumExceeded extends TalkError {
  constructor() {
    super('You have made too many incorrect password attempts.', {
      translation_key: 'LOGIN_MAXIMUM_EXCEEDED',
      status: 429,
    });
  }
}

// ErrEditWindowHasEnded is returned when the edit window has expired.
class ErrEditWindowHasEnded extends TalkError {
  constructor() {
    super('Edit window is over', {
      translation_key: 'EDIT_WINDOW_ENDED',
      status: 403,
    });
  }
}

// ErrCommentTooShort is returned when the comment is too short.
class ErrCommentTooShort extends TalkError {
  constructor(length) {
    super(
      'Comment was too short',
      {
        translation_key: 'COMMENT_TOO_SHORT',
        status: 400,
      },
      { length }
    );
  }
}

// ErrCommentTooLong is returned when the comment is too long.
class ErrCommentTooLong extends TalkError {
  constructor(length, allowed) {
    super(
      'Comment was too long',
      {
        translation_key: 'COMMENT_TOO_LONG',
        status: 400,
      },
      { length, allowed }
    );
  }
}

// ErrAssetURLAlreadyExists is returned when a rename operation is requested
// but an asset already exists with the new url.
class ErrAssetURLAlreadyExists extends TalkError {
  constructor() {
    super('Asset URL already exists, cannot rename', {
      translation_key: 'ASSET_URL_ALREADY_EXISTS',
      status: 409,
    });
  }
}

// ErrNotVerified is returned when a user tries to login with valid credentials
// but their email address is not yet verified.
class ErrNotVerified extends TalkError {
  constructor() {
    super('User does not have a verified email address', {
      translation_key: 'EMAIL_NOT_VERIFIED',
      status: 401,
    });
  }
}

class ErrMaxRateLimit extends TalkError {
  constructor(max, tries) {
    super(
      'Rate limit exceeded',
      {
        translation_key: 'RATE_LIMIT_EXCEEDED',
        status: 429,
      },
      { tries, max }
    );
  }
}

// ErrCannotIgnoreStaff is returned when a user tries to ignore a staff member.
class ErrCannotIgnoreStaff extends TalkError {
  constructor() {
    super('Cannot ignore staff members.', {
      translation_key: 'CANNOT_IGNORE_STAFF',
      status: 400,
    });
  }
}

// ErrParentDoesNotVisible is returned when the user tries to reply to a comment
// that isn't visible.
class ErrParentDoesNotVisible extends TalkError {
  constructor() {
    super('Cannot reply to a comment that is not visible', {
      translation_key: 'COMMENT_PARENT_NOT_VISIBLE',
    });
  }
}

class ErrPasswordIncorrect extends TalkError {
  constructor() {
    super('Your current password was entered incorrectly', {
      translation_key: 'PASSWORD_INCORRECT',
    });
  }
}

module.exports = {
  TalkError,
  ErrAlreadyExists,
  ErrAssetCommentingClosed,
  ErrAssetURLAlreadyExists,
  ErrAuthentication,
  ErrCannotIgnoreStaff,
  ErrCommentingDisabled,
  ErrCommentTooLong,
  ErrCommentTooShort,
  ErrContainsProfanity,
  ErrEditWindowHasEnded,
  ErrEmailAlreadyVerified,
  ErrEmailTaken,
  ErrEmailVerificationToken,
  ErrHTTPNotFound,
  ErrInstallLock,
  ErrInvalidAssetURL,
  ErrLoginAttemptMaximumExceeded,
  ErrMaxRateLimit,
  ErrMissingEmail,
  ErrMissingPassword,
  ErrMissingUsername,
  ErrNotAuthorized,
  ErrNotFound,
  ErrNotVerified,
  ErrParentDoesNotVisible,
  ErrPasswordIncorrect,
  ErrPasswordResetToken,
  ErrPasswordTooShort,
  ErrPermissionUpdateUsername,
  ErrSameUsernameProvided,
  ErrSettingsInit,
  ErrSettingsNotInit,
  ErrSpecialChars,
  ErrUsernameTaken,
  ExtendableError,
};
