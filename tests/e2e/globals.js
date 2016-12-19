export default {
  beforeEach: function(browser, done) {
    console.log('Before Each');
    setTimeout(function() {
      // finished async duties
      done();
    }, 100);
  },
  afterEach: function(browser, done) {
    console.log('After Each');
    setTimeout(function() {
      // finished async duties
      done();
    }, 200);
  },
  waitForConditionTimeout: 8000,
  baseUrl: 'http://localhost:3000',
  users: {
    admin: {
      email: 'admin@test.com',
      pass: 'test'
    },
    moderator: {
      email: 'moderator@test.com',
      pass: 'test'
    },
    commenter: {
      email: 'commenter@test.com',
      pass: 'test'
    }
  },
};
