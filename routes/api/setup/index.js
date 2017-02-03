const express = require('express');

const errors = require('../../../errors');

const SetupService = require('../../../services/setup');
const SettingsService = require('../../../services/settings');

const router = express.Router();

router.post('/', (req, res, next) => {

  // Check if we have an install lock present.
  if (process.env.TALK_INSTALL_LOCK === 'TRUE') {
    return next(errors.ErrInstallLock);
  }

  // Get the current settings, we are expecing an error here.
  SettingsService
    .retrieve()
    .then(() => {

      // We should NOT have gotten a settings object, this means that the
      // application is already setup. Error out here.
      return next(errors.ErrSettingsInit);

    })
    .catch((err) => {

      // If the error is `not init`, then we're good, otherwise, it's something
      // else.
      if (err !== errors.ErrSettingsNotInit) {
        return next(err);
      }

      // Allow the request to keep going here.
      return next();
    });

}, (req, res, next) => {

  const {
    settings,
    user: {email, password, displayName}
  } = req.body;

  SetupService
    .setup({settings, user: {email, password, displayName}})
    .then(() => {

      // We're setup!
      res.status(204).end();
    })
    .catch((err) => {
      return next(err);
    });

});

module.exports = router;
