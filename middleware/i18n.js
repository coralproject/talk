const i18n = require('../services/i18n');

module.exports = (req, res, next) => {
  res.locals.t = i18n.request(req);
  next();
};
