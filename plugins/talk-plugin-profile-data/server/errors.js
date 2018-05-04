const { TalkError } = require('errors');

// ErrDownloadToken is returned in the event that the download is requested
// without a valid token.
class ErrDownloadToken extends TalkError {
  constructor(err) {
    super(
      'Token is invalid',
      {
        translation_key: 'DOWNLOAD_TOKEN_INVALID',
        status: 400,
      },
      { err }
    );
  }
}

// ErrDeletionAlreadyScheduled is returned when a user requests that their
// account get deleted when their account is already scheduled for deletion.
class ErrDeletionAlreadyScheduled extends TalkError {
  constructor() {
    super('Deletion is already scheduled', {
      translation_key: 'DELETION_ALREADY_SCHEDULED',
      status: 400,
    });
  }
}
// ErrDeletionNotScheduled is returned when a user requests that their
// account deletion to be canceled when it was not scheduled for deletion.
class ErrDeletionNotScheduled extends TalkError {
  constructor() {
    super('Deletion was not scheduled', {
      translation_key: 'DELETION_NOT_SCHEDULED',
      status: 400,
    });
  }
}

module.exports = {
  ErrDownloadToken,
  ErrDeletionAlreadyScheduled,
  ErrDeletionNotScheduled,
};
