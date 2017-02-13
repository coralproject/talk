module.exports = {
  waitForConditionTimeout: 8000,
  baseUrl: 'http://localhost:3011',
  users: {
    admin: {
      displayName: 'AdminTestUser',
      email: 'admin@test.com',
      password: 'testtest'
    },
    moderator: {
      displayName: 'ModeratorTestUser',
      email: 'moderator@test.com',
      password: 'testtest'
    },
    commenter: {
      displayName: 'CommentTestUser',
      email: 'commenter@test.com',
      password: 'testtest'
    }
  },
  comments: (author_id) =>
    ([{
      body: 'I read the comments.',
      status: 'ACCEPTED',
      author_id
    },
    {
      body: 'You read the comments',
      status: 'ACCEPTED',
      author_id
    }])
};
