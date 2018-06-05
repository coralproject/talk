const { VIEW_PROTECTED_SETTINGS } = require('../../perms/constants');
const { decorateWithPermissionCheck } = require('./util');

const Settings = {
  karmaThresholds: (
    settings,
    args,
    {
      connectors: {
        services: {
          Karma: { THRESHOLDS },
        },
      },
    }
  ) => THRESHOLDS,
};

// PROTECTED_SETTINGS are the settings keys that must be protected for only some
// eyes.
const PROTECTED_SETTINGS = {
  premodLinksEnable: [VIEW_PROTECTED_SETTINGS],
  autoCloseStream: [VIEW_PROTECTED_SETTINGS],
  wordlist: [VIEW_PROTECTED_SETTINGS],
  domains: [VIEW_PROTECTED_SETTINGS],
  karmaThresholds: [VIEW_PROTECTED_SETTINGS],
};

// decorate the fields on the settings resolver with a permission check.
decorateWithPermissionCheck(Settings, PROTECTED_SETTINGS);

module.exports = Settings;
