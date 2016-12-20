module.exports = {
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
