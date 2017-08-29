const {
  VIEW_PROTECTED_SETTINGS,
} = require('../../perms/constants');

const {decorateWithPermissionCheck} = require('./util');

const Settings = {};

// PROTECTED_SETTINGS are the settings keys that must be protected for only some
// eyes.
const PROTECTED_SETTINGS = [
  'premodLinksEnable',
  'autoCloseStream',
  'wordlist',
  'domains',
];

// decorate the fields on the settings resolver with a permission check.
decorateWithPermissionCheck(Settings, VIEW_PROTECTED_SETTINGS, ...PROTECTED_SETTINGS);

module.exports = Settings;
