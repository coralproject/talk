const mongoose = require('../../services/mongoose');
const Schema = mongoose.Schema;

const TokenSchema = new Schema({
  // ID is the JTI of a given JWT's identifier.
  id: String,

  // Name is given by the user on token creation.
  name: String,

  // Active is used to determine if the token is valid.
  active: Boolean,
});

module.exports = TokenSchema;
