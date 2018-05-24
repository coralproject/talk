const { get, merge } = require('lodash');
const uuid = require('uuid/v4');

// nonce is designed to create a random value that can be used in conjunction
// with the csp middleware.
module.exports = (req, res, next) => {
  const nonce = uuid();

  // Attach the nonce to the locals.
  res.locals.nonce = nonce;
  res.locals.data = merge({}, get(res.locals, 'data', {}), {
    SCRIPT_NONCE: nonce,
  });

  next();
};
