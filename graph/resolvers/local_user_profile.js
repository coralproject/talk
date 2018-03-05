const { property } = require('lodash');

const LocalUserProfile = {
  confirmedAt: property('metadata.confirmed_at'),
};

module.exports = LocalUserProfile;
