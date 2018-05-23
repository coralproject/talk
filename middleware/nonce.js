const uuid = require('uuid/v4');

// nonce is designed to create a random value that can be used in conjunction
// with the csp middleware.
module.exports = (req, res, next) => {
  res.locals.nonce = uuid();

  next();
};
