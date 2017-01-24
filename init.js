const SettingsService = require('./services/settings');

module.exports = () => Promise.all([

  // Upsert the settings object.
  SettingsService.init({
    moderation: 'PRE',
    wordlist: {
      banned: [],
      suspect: []
    }
  })
]);
