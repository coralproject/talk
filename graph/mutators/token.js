const { ErrNotAuthorized } = require('../../errors');
const TokensService = require('../../services/tokens');
const { CREATE_TOKEN, REVOKE_TOKEN } = require('../../perms/constants');

// Creates a new token for a user.
const createToken = async ({ user }, { name }) => {
  let { pat, jwt } = await TokensService.create(user.id, name);

  // Attach the token to the PAT.
  pat.jwt = jwt;

  // Return that PAT!
  return pat;
};

// Revokes the token from the user.
const revokeToken = async ({ user }, { id }) => {
  return TokensService.revoke(user.id, id);
};

module.exports = context => {
  let mutators = {
    Token: {
      create: () => Promise.reject(new ErrNotAuthorized()),
      revoke: () => Promise.reject(new ErrNotAuthorized()),
    },
  };

  if (context.user && context.user.can(CREATE_TOKEN)) {
    mutators.Token.create = input => createToken(context, input);
  }

  if (context.user && context.user.can(REVOKE_TOKEN)) {
    mutators.Token.revoke = input => revokeToken(context, input);
  }

  return mutators;
};
