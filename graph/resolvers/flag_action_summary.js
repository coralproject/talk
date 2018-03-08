const { property } = require('lodash');

const FlagActionSummary = {
  reason: property('group_id'),
};

module.exports = FlagActionSummary;
