const Setting = require('../models/setting');
const defaults = {id: '1', moderation: 'pre'};

Setting.update({id: '1'}, {$setOnInsert: defaults}, {upsert: true}).then(() => {
  throw new Error('It was not able to update settings.');
}).catch(console.error);
