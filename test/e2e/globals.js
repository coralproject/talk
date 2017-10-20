const serve = require('../../serve');
const mongoose = require('../../services/mongoose');
const {shutdown} = require('../../bin/util');

module.exports = {
  before: async (done) => {
    await mongoose.connection.dropDatabase();
    await serve();
    done();
  },
  after: (done) => {
    shutdown();
    done();
  },
  waitForConditionTimeout: 5000,
  testData: {
    admin: {
      email: 'admin@test.com',
      username: 'admin',
      password: 'testtest',
    },
    user: {
      email: 'user@test.com',
      username: 'user',
      password: 'testtest',
    },
    comment: {
      body: 'This is a test comment'
    },
    organizationName: 'Coral',
  }
};
