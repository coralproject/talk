const intersection = require('lodash/intersection');
const check = (user, roles) => {
  return intersection(roles, user.roles).length > 0;
};

module.exports = {
  check
};
