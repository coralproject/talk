require('../../../utils/mongoose');

const app = require('../../../../app');
const chai = require('chai');
const expect = chai.expect;

// Setup chai.
chai.should();
chai.use(require('chai-http'));

const Action = require('../../../../models/action');
const User = require('../../../../models/user');
const Comment = require('../../../../models/comment');

const Setting = require('../../../../models/setting');

describe('api/stream: routes', () => {

  const settings = {id: '1', moderation: 'pre'};

  const comments = [{
    id: 'abc',
    body: 'comment 10',
    asset_id: 'asset',
    author_id: '123',
    parent_id: '',
    status: 'accepted'
  }, {
    id: 'def',
    body: 'comment 20',
    asset_id: 'asset',
    author_id: '456',
    parent_id: '',
    status: ''
  }, {
    id: 'uio',
    body: 'comment 30',
    asset_id: 'asset',
    author_id: '456',
    parent_id: '',
    status: ''
  }, {
    id: 'hij',
    body: 'comment 40',
    asset_id: '456',
    status: 'rejected'
  }];

  const users = [{
    displayName: 'Ana',
    email: 'ana@gmail.com',
    password: '123'
  }, {
    displayName: 'Maria',
    email: 'maria@gmail.com',
    password: '123'
  }];

  const actions = [{
    action_type: 'flag',
    item_id: 'abc'
  }, {
    action_type: 'like',
    item_id: 'hij'
  }];

  beforeEach(() => {

    return User
      .createLocalUsers(users)
      .then(users => {

        comments[0].author_id = users[0].id;
        comments[1].author_id = users[1].id;
        
        return Promise.all([
          Comment.create(comments),
          Action.create(actions),
          Setting.create(settings)
        ]);

      });

  });

  it('should return a stream with comments, users and actions', () => {
    return chai.request(app)
      .get('/api/v1/stream')
      .query({'asset_id': 'asset'})
      .then(res => {
        expect(res).to.have.status(200);
        expect(res.body.length).to.equal(3);
      });
  });
});
