const { get } = require('lodash');

module.exports = {
  Settings: {
    globalSwitchoffEnable: settings =>
      get(settings, 'globalSwitchoffEnable', false),
    globalSwitchoffMessage: settings =>
      get(settings, 'globalSwitchoffMessage', ''),
  },
};
