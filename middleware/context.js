const Context = require('../graph/context');

// Attach a new context to the request.
module.exports = (req, res, next) => {
  req.context = new Context(req);

  next();
};
