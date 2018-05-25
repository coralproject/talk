const mongoose = require('../../services/mongoose');
const { shutdown } = require('../../bin/util');

module.exports = {
  before: async done => {
    console.log('Dropping test database');
    await mongoose.connection.dropDatabase();
    done();
  },
  after: done => {
    shutdown();
    done();
  },
  waitForConditionTimeout: parseInt(process.env.WAIT_FOR_TIMEOUT) || 10000,
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
    organizationName: 'Coral',
    organizationContactEmail: 'coral@coralproject.net',
  },
};
