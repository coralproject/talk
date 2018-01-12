const { JWT_SECRETS, JWT_SECRET, JWT_ALG } = require('./config');

const debug = require('debug')('talk:secrets');
const jwt = require('./services/jwt');

if (JWT_SECRETS) {
  if (!Array.isArray(JWT_SECRETS)) {
    throw new Error(
      'TALK_JWT_SECRETS must be a JSON array in the form [{"kid": kid, ["secret": secret | "private": private, "public": public]}, ...]'
    );
  }

  if (JWT_SECRETS.length === 0) {
    throw new Error(
      'TALK_JWT_SECRETS must be a JSON array with non zero length'
    );
  }

  // Wrap a multi-secret around the available secrets.
  module.exports.jwt = new jwt.MultiSecret(
    JWT_SECRETS.map(secret => {
      if (!('kid' in secret)) {
        throw new Error(
          "when multiple keys are specified, kid's must be specified"
        );
      }

      if (typeof secret.kid !== 'string' || secret.kid.length === 0) {
        throw new Error('kid must be a unique string');
      }

      // HMAC secrets do not have public/private keys.
      if (JWT_ALG.startsWith('HS')) {
        return new jwt.SharedSecret(secret, JWT_ALG);
      }

      if (!('public' in secret)) {
        throw new Error(
          'all symetric keys must provide a PEM encoded public key'
        );
      }

      return new jwt.AsymmetricSecret(secret, JWT_ALG);
    })
  );

  debug(
    `loaded ${JWT_SECRETS.length} ${
      JWT_ALG.startsWith('HS') ? 'shared' : 'asymmetric'
    } secrets`
  );
} else if (JWT_SECRET) {
  if (JWT_ALG.startsWith('HS')) {
    module.exports.jwt = new jwt.SharedSecret(
      {
        secret: JWT_SECRET,
      },
      JWT_ALG
    );
  } else {
    module.exports.jwt = new jwt.AsymmetricSecret(
      JSON.parse(JWT_SECRET),
      JWT_ALG
    );
  }

  debug(
    `loaded a ${JWT_ALG.startsWith('HS') ? 'shared' : 'asymmetric'} secret`
  );
}
