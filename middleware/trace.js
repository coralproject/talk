const uuid = require('uuid/v1');

// Trace middleware attaches a request id to each incoming request.
module.exports = (req, res, next) => {
  req.id = uuid();

  // Add the context ID to the request as an HTTP header.
  res.set('X-Talk-Trace-ID', req.id);

  next();
};
