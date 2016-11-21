const Setting = require('./models/setting');
const wordlist = require('../services/wordlist');

module.exports = () => Promise.all([

  // Upsert the settings object.
  Setting
    .init({id: '1', moderation: 'pre'})
    .then(() => {

      // Load in the wordlist now that settings have been init'd.
      return wordlist.init();
    })

]);
