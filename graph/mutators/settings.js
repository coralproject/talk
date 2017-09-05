const errors = require('../../errors');

const {
  UPDATE_SETTINGS,
  UPDATE_WORDLIST,
} = require('../../perms/constants');

const SettingsService = require('../../services/settings');

const update = async (ctx, settings) => SettingsService.update(settings);

const updateWordlist = async (ctx, wordlist) => SettingsService.updateWordlist(wordlist);

module.exports = (ctx) => {
  let mutators = {
    Settings: {
      update: () => Promise.reject(errors.ErrNotAuthorized),
      updateWordlist: () => Promise.reject(errors.ErrNotAuthorized)
    }
  };

  if (ctx.user) {
    if (ctx.user.can(UPDATE_SETTINGS)) {
      mutators.Settings.update = (id, settings) => update(ctx, id, settings);
    }

    if (ctx.user.can(UPDATE_WORDLIST)) {
      mutators.Settings.updateWordlist = (id, status) => updateWordlist(ctx, id, status);
    }
  }

  return mutators;
};
