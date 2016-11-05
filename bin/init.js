const Setting = require('../models/setting');
const defaults = {id: '1', moderation: 'pre'};

Setting.update({id: '1'}, {$setOnInsert: defaults}, {upsert: true}).then(() => {
  console.log('created settings object.');
//  process.exit(); // Removed to satisfy hooks
}).catch(console.error);
