const UsersService = require('./users');
const SettingsService = require('./settings');
const SettingsModel = require('../models/setting');
const errors = require('../errors');

/**
 * This service is used when we want to setup the application. It is consumed by
 * the dynamic setup endpoint and by the cli-setup tool.
 */
module.exports = class SetupService {

  /**
   * This returns a promise which resolves if the setup is available.
   */
  static isAvailable() {

    // Check if we have an install lock present.
    if (process.env.TALK_INSTALL_LOCK === 'TRUE') {
      return Promise.reject(errors.ErrInstallLock);
    }

    // Get the current settings, we are expecing an error here.
    return SettingsService
      .retrieve()
      .then(() => {

        // We should NOT have gotten a settings object, this means that the
        // application is already setup. Error out here.
        return Promise.reject(errors.ErrSettingsInit);

      })
      .catch((err) => {

        // If the error is `not init`, then we're good, otherwise, it's something
        // else.
        if (err !== errors.ErrSettingsNotInit) {
          return Promise.reject(err);
        }

        // Allow the request to keep going here.
        return;
      });
  }

  /**
   * This verifies that the current input for the setup is valid.
   */
  static validate({settings, user: {email, displayName, password}}) {

    // Verify the email address of the user.
    if (!email) {
      return Promise.reject(errors.ErrMissingEmail);
    }

    // Create a settings model to use for validation.
    let settingsModel = new SettingsModel(settings);

    // Verify other properties of the user.
    return Promise.all([
      UsersService.isValidDisplayName(displayName, false),
      UsersService.isValidPassword(password),
      settingsModel.validate()
    ]);
  }

  /**
   * This will perform the setup.
   */
  static setup({settings, user: {email, password, displayName}}) {

    // Validate the settings first.
    return SetupService
      .validate({settings, user: {email, password, displayName}})
      .then(() => {
        return SettingsService.update(settings);
      })
      .then((settings) => {

        // Settings are created! Create the user.

        // Create the user.
        return UsersService
          .createLocalUser(email, password, displayName)

          // Grant them administrative privileges and confirm the email account.
          .then((user) => {

            return Promise.all([
              UsersService.addRoleToUser(user.id, 'ADMIN'),
              UsersService.confirmEmail(user.id, email)
            ])
            .then(() => ({
              settings,
              user
            }));
          });
      });
  }

};
