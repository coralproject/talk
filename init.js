const SettingsService = require('./services/settings');

module.exports = () => Promise.all([

  // Upsert the settings object.
  SettingsService.init({
    moderation: 'POST',
    wordlist: {
      banned: [],
      suspect: []
    }
  })
]);
