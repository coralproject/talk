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

describe('api/stream: routes', () => {
  const comments = [{
    id: 'abc',
    body: 'comment 10',
    asset_id: 'asset',
    author_id: '123'
  }, {
    id: 'def',
    body: 'comment 20',
    asset_id: 'asset',
    author_id: '456'
  }, {
    id: 'hij',
    body: 'comment 30',
    asset_id: '456'
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
    return Promise.all([
      Comment.create(comments),
      User.createLocalUsers(users),
      Action.create(actions)
    ]);
  });

  it('should return a stream with comments, users and actions', function(done){
    chai.request(app)
      .get('/api/v1/stream')
      .query({'asset_id': 'asset'})
      .end(function(err, res){
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });
});
