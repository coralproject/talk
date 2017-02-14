const exec = require('child_process').exec;

module.exports = () => {
  exec('mongo test --eval "db.dropDatabase()"');
};
