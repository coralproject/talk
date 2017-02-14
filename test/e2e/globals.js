module.exports = {
  waitForConditionTimeout: 8000,
  baseUrl: 'http://localhost:3011',
  users: {
    admin: {
      username: 'AdminTestUser',
      email: 'admin@test.com',
      password: 'testtest',
      roles: ['ADMIN']
    },
    moderator: {
      username: 'ModeratorTestUser',
      email: 'moderator@test.com',
      password: 'testtest',
      roles: ['MODERATOR']
    },
    commenter: {
      username: 'CommentTestUser',
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
