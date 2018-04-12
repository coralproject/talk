const uuid = require('uuid/v1');

// Trace middleware attaches a request id to each incoming request.
module.exports = (req, res, next) => {
  req.id = uuid();
  next();
};
