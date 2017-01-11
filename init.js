const Setting = require('./models/setting');

module.exports = () => Promise.all([

  // Upsert the settings object.
  Setting.init({id: '1', moderation: 'pre', wordlist: {banned: [], suspect: []}})
]);
