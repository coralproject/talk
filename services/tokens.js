const errors = require('../errors');
const UserModel = require('../models/user');
const uuid = require('uuid');
const { set } = require('lodash');

const { JWT_ISSUER, JWT_AUDIENCE, JWT_USER_ID_CLAIM } = require('../config');

const { jwt: JWT_SECRET } = require('../secrets');

/**
 * TokenService manages Personal Access Tokens for users. These tokens are
 * persisted in the database and attached to the user.
 */
module.exports = class TokenService {
  /**
   * Creates a token for a user with a given name.
   *
   * @param {String} userID     the id of the user owning the token
   * @param {String} tokenName  the name of the token to be created
   */
  static async create(userID, tokenName) {
    // Create the token.
    const payload = {
      jti: uuid.v4(),
      iss: JWT_ISSUER,
      aud: JWT_AUDIENCE,
      pat: true,
    };

    if (userID) {
      set(payload, JWT_USER_ID_CLAIM, userID);
    }

    // Sign the payload.
    const jwt = JWT_SECRET.sign(payload, {});

    // Create the PAT.
    let pat = {
      id: payload.jti,
      name: tokenName,
      active: true,
    };

    // Wait to update the user model with the new PAT.
    await UserModel.update(
      { id: userID },
      {
        $push: {
          tokens: pat,
        },
      }
    );

    return { payload, jwt, pat };
  }

  /**
   * Revokes a token and prevents the token from being used. Once a token has
   * been revoked, it cannot be re-enabled.
   *
   * @param {String} userID     the id of the user owning the token
   * @param {String} tokenID    the jti of the token to revoke
   */
  static async revoke(userID, tokenID) {
    let query = {
      tokens: {
        $elemMatch: {
          id: tokenID,
        },
      },
    };

    if (userID) {
      query.id = userID;
    }

    // Revoke the token id.
    await UserModel.update(query, {
      $set: {
        'tokens.$.active': false,
      },
    });
  }

  /**
   * Validate that a given Token is valid.
   *
   * @param {String} userID the user's id that owns the token
   * @param {String} tokenID the id of the token
   */
  static async validate(userID, tokenID) {
    // Find the user.
    let user = await UserModel.findOne({
      id: userID,
    });
    if (!user || !user.tokens) {
      throw new errors.ErrAuthentication('user does not exist');
    }

    // Extract the token from the user.
    let token = user.tokens.find(({ id }) => id === tokenID);
    if (!token) {
      throw new errors.ErrAuthentication('token does not exist');
    }

    // Check to see if it is active.
    if (!token.active) {
      throw new errors.ErrAuthentication('token is not active');
    }

    return user;
  }

  /**
   * Lists the tokens owned by the user.
   *
   * @param {String} userID     the id of the user owning the token
   */
  static async list(userID) {
    // Get the user specified by the id.
    let user = await UserModel.findOne({ id: userID }).select('tokens');
    if (!user || !user.tokens) {
      return [];
    }

    return user.tokens;
  }
};
