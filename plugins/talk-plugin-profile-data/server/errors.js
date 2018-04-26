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

module.exports = { ErrDownloadToken };
