module.exports = {
  waitForConditionTimeout: 8000,
  baseUrl: 'http://localhost:3000',
  users: {
    admin: {
      email: 'admin@test.com',
      pass: 'testtest'
    },
    moderator: {
      email: 'moderator@test.com',
      pass: 'testtest'
    },
    commenter: {
      email: 'commenter@test.com',
      pass: 'testtest'
    }
  },
};
