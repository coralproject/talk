const authorization = require('../../middleware/authorization');

// Add the passport middleware here before it's setup.
authorization.middleware.push((req, res, next) => {
  req.user = JSON.parse(
    new Buffer(req.get('X-Mock-Authorization'), 'base64').toString('ascii')
  );

  next();
});

const MockStrategy = {
  /**
   * Injects the new user into the request header for the mock middleware to
   * interpret.
   * @param  {Object} user the user to inject
   * @return {Object}      the headers to add to the request
   */
  inject(user) {
    return {
      'X-Mock-Authorization': new Buffer(JSON.stringify(user)).toString(
        'base64'
      ),
    };
  },
};

module.exports = MockStrategy;
