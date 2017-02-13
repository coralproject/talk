const exec = require('child_process').exec;

module.exports = () => {
  console.log('Clearing DB');
  exec('mongo test --eval "db.dropDatabase()"');
};
