const UserModel = require('../models/user');
const {GeneratePersonalAccessToken} = require('./passport');

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
    let {payload, jwt} = GeneratePersonalAccessToken(userID);

    // Create the PAT.
    let pat = {
      id: payload.jti,
      name: tokenName,
      active: true
    };

    // Wait to update the user model with the new PAT.
    await UserModel.update({id: userID}, {
      $push: {
        tokens: pat
      }
    });

    return {payload, jwt, pat};
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
          id: tokenID
        }
      }
    };

    if (userID) {
      query.id = userID;
    }

    // Revoke the token id.
    await UserModel.update(query, {
      $set: {
        'tokens.$.active': false
      }
    });
  }

  /**
   * Lists the tokens owned by the user.
   *
   * @param {String} userID     the id of the user owning the token
   */
  static async list(userID) {

    // Get the user specified by the id.
    let user = await UserModel.findOne({id: userID}).select('tokens');
    if (!user || !user.tokens) {
      return [];
    }

    return user.tokens;
  }

};
