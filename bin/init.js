const mongoose = require('../mongoose');
const Setting = require('../models/setting');
const defaults = {id: '1', moderation: 'pre'};

Setting.update({id: '1'}, {$setOnInsert: defaults}, {upsert: true})
  .then(() => {
    console.log('Created settings object.');
    mongoose.disconnect();
  }).catch((err) => {
    console.error(`failed to create the settings object ${JSON.stringify(err)}`);
    mongoose.disconnect();
    throw new Error(err); // just to be safe
  });
