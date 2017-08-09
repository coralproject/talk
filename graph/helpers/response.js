const errors = require('../../errors');
const {Error: {ValidationError}} = require('mongoose');

/**
 * Wraps up a promise or value to return an object with the resolution of the promise
 * keyed at `key` or an error caught at `errors`.
 */

const wrapResponse = (key) => async (promise) => {
  try {
    let value = await promise;
    
    let res = {};
    if (key) {
      res[key] = value;
    }

    return res;
  } catch (err) {
    if (err instanceof errors.APIError) {
      return {
        errors: [err]
      };
    } else if (err instanceof ValidationError) {

      // TODO: wrap this with one of our internal errors.
      throw err;
    }

    throw err;
  }
};

module.exports = wrapResponse;
