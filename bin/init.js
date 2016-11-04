const Setting = require('../models/setting');
const defaults = {id: '1', moderation: 'pre'};

try {
  Setting.update({id: '1'}, {$setOnInsert: defaults}, {upsert: true})
    .then(() => {
      console.log('Created settings object.');
    }).catch((err) => {
      if (err) throw err;
    });
} catch (err) {
  console.log('Cannot create settings object.');
}
