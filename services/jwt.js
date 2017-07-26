const jwt = require('jsonwebtoken');

/**
 * MultiSecret will take many secrets and provide a unified interface for
 * handling verifying and signing.
 */
class MultiSecret {
  constructor(secrets) {
    this.secrets = secrets;
  }

  sign(payload, options) {
    return this.secrets[0].sign(payload, options);
  }

  verify(token, options, callback) {
    let header = null;
    try {
      header = JSON.parse(Buffer(token.split('.')[0], 'base64').toString());
    } catch(err) {
      return callback(err);
    }

    if (!('kid' in header)) {
      return callback(new Error('expected kid to exist in the token header, it did not.'));
    }

    let kid = header.kid;
    let verifier = this.secrets.find((secret) => secret.kid === kid);
    if (!verifier) {
      return callback(new Error(`expected kid ${kid} was not available.`));
    }

    return verifier.verify(token, options, callback);
  }
}

class SharedSecret {
  constructor({kid = undefined, secret}) {
    this.kid = kid;
    this.secret = secret;
  }

  sign(payload, options) {
    return jwt.sign(payload, this.secret, Object.assign({}, options, {
      keyid: this.kid
    }));
  }

  verify(token, options, callback) {
    jwt.verify(token, this.secret, options, callback);
  }
}

class AsymmetricSecret {
  constructor({kid = undefined, private: privateKey, public: publicKey}) {
    this.kid = kid;
    this.public = Buffer.from(publicKey.replace(/\\n/g, '\n'));
    this.private = privateKey ? Buffer.from(privateKey.replace(/\\n/g, '\n')) : null;
  }

  sign(payload, options) {
    if (!this.private) {
      throw new Error('no private key on secret, cannot sign');
    }

    return jwt.sign(payload, this.private, Object.assign({}, options, {
      keyid: this.kid
    }));
  }

  verify(token, options, callback) {
    jwt.verify(token, this.public, options, callback);
  }
}

module.exports = {
  AsymmetricSecret,
  SharedSecret,
  MultiSecret
};
