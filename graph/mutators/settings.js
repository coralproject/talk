const errors = require('../../errors');

const { UPDATE_SETTINGS } = require('../../perms/constants');

const SettingsService = require('../../services/settings');

const update = async (ctx, settings) => SettingsService.update(settings);

module.exports = ctx => {
  let mutators = {
    Settings: {
      update: () => Promise.reject(errors.ErrNotAuthorized),
    },
  };

  if (ctx.user) {
    if (ctx.user.can(UPDATE_SETTINGS)) {
      mutators.Settings.update = (id, settings) => update(ctx, id, settings);
    }
  }

  return mutators;
};
