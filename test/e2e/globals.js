const uuid = require('uuid');
const {murmur3} = require('murmurhash-js');
const rHash = murmur3(uuid.v4());

module.exports = {
  waitForConditionTimeout: 5000,
  testData: {
    organizationName: 'Coral',
    email: `test_${rHash}@test.test`,
    username: `test${rHash}`,
    password: `testpassword${rHash}`,
    domain: 'http://localhost:3000'
  }
};
