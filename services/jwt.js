const jwt = require('jsonwebtoken');
const { merge, uniq, omitBy, isUndefined } = require('lodash');

/**
 * MultiSecret will take many secrets and provide a unified interface for
 * handling verifying and signing.
 */
class MultiSecret {
  constructor(secrets) {
    this.kids = secrets.map(({ kid }) => kid);

    if (uniq(this.kids).length !== secrets.length) {
      throw new Error(
        "Duplicate kid's cannot be used to construct a MultiSecret"
      );
    }

    this.secrets = secrets;
  }

  /**
   * Sign will sign with the first secret.
   */
  sign(payload, options) {
    return this.secrets[0].sign(
      omitBy(payload, isUndefined),
      omitBy(options, isUndefined)
    );
  }

  /**
   * Verify will parse the token and determine the kid, then match it to the
   * available secrets, using that to perform the verification.
   */
  verify(token, options, callback) {
    let header = null;
    try {
      header = JSON.parse(Buffer(token.split('.')[0], 'base64').toString());
    } catch (err) {
      return callback(err);
    }

    if (!('kid' in header)) {
      return callback(
        new Error('expected kid to exist in the token header, it did not.')
      );
    }

    let kid = header.kid;
    let verifier = this.secrets.find(secret => secret.kid === kid);
    if (!verifier) {
      return callback(new Error(`expected kid ${kid} was not available.`));
    }

    return verifier.verify(token, options, callback);
  }
}

/**
 * Secret wraps the capabilities expected of a Secret, signing and verifying.
 */
class Secret {
  constructor({ kid, signingKey, verifiyingKey, algorithm }) {
    this.kid = kid;
    this.signingKey = signingKey;
    this.verifiyingKey = verifiyingKey;
    this.algorithm = algorithm;
  }

  /**
   * Sign will sign the payload with the secret.
   *
   * @param {Object} payload the object to sign
   * @param {Object} options the signing options
   */
  sign(payload, options) {
    if (!this.signingKey) {
      throw new Error('no signing key on secret, cannot sign');
    }

    return jwt.sign(
      payload,
      this.signingKey,
      omitBy(
        merge({}, options, {
          keyid: this.kid,
          algorithm: this.algorithm,
        }),
        isUndefined
      )
    );
  }

  /**
   * Verify will ensure that the given token was indeed signed with this secret.
   * @param {String} token the token to verify
   * @param {Object} options the verification options
   * @param {Function} callback the function to call with the verification results
   */
  verify(token, options, callback) {
    jwt.verify(
      token,
      this.verifiyingKey,
      omitBy(
        merge({}, options, {
          algorithms: [this.algorithm],
        }),
        isUndefined
      ),
      callback
    );
  }
}

/**
 * SharedSecret is the HMAC based secret that's used for signing/verifying.
 */
function SharedSecret({ kid = undefined, secret = null }, algorithm) {
  if (secret === null || secret.length === 0) {
    throw new Error('Secret cannot have a zero length');
  }

  // If the secret is base64 encoded, then decode it!
  if (secret.startsWith('base64:')) {
    secret = Buffer.from(secret.substring(7), 'base64').toString();
  }

  return new Secret({
    kid,
    signingKey: secret,
    verifiyingKey: secret,
    algorithm,
  });
}

/**
 * AsymmetricSecret is the Asymmetric based key, where a private key is optional
 * and the public key is required.
 */
function AsymmetricSecret(
  { kid = undefined, private: privateKey, public: publicKey },
  algorithm
) {
  publicKey = Buffer.from(publicKey.replace(/\\n/g, '\n'));
  privateKey =
    privateKey && privateKey.length > 0
      ? Buffer.from(privateKey.replace(/\\n/g, '\n'))
      : null;

  return new Secret({
    kid,
    signingKey: privateKey,
    verifiyingKey: publicKey,
    algorithm,
  });
}

module.exports = {
  AsymmetricSecret,
  SharedSecret,
  MultiSecret,
};
