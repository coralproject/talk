const { get } = require('lodash');

module.exports = {
  Settings: {
    globalSwitchoffEnable: settings =>
      get(settings, 'metadata.globalSwitchoffEnable', false),
    globalSwitchoffMessage: settings =>
      get(settings, 'metadata.globalSwitchoffMessage', ''),
  },
};
