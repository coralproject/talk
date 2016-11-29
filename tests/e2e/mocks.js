const Comments = require('../../models/comment')
const Users = require('../../models/user')
const Actions = require('../../models/action')

const mockComments = [
  {
    body: 'Pangolin pups are called pangopups.',
    author_id: '123',
    id: 'abc'
  },
  {
    body: 'Baby whales grow at up to 8lbs an hour.',
    author_id: '456',
    id: 'def'
  }
];

console.log('Loading mocks.');

Comments.create(mockComments);
