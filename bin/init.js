const MongoClient = require('mongodb').MongoClient;
const url = process.env.TALK_MONGO_URL;

if (!url) {
  throw new Error('environment variable TALK_MONGO_URL must be defined');
}

MongoClient.connect(url).then(db => {
  const Setting = db.collection('settings');
  const defaults = {id: 1, moderation: 'pre'};

  Setting.update({id: 1}, {$setOnInsert: defaults}, {upsert: true}).then(() => {
    console.log('created settings object.');
    process.exit();
  });
}).catch(console.error);
