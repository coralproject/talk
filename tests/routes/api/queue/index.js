process.env.NODE_ENV = 'test';

require('../../../utils/mongoose');

const app = require('../../../../app');
const chai = require('chai');
const expect = chai.expect;

// Setup chai.
chai.should();
chai.use(require('chai-http'));

const Comment = require('../../../../models/comment');
const Action = require('../../../../models/action');
const User = require('../../../../models/user');

const Setting = require('../../../../models/setting');
const settings = {id: '1', moderation: 'pre'};

beforeEach(() => {
  return Setting.create(settings);
});

describe('Get moderation queues rejected, pending, flags', () => {
  const comments = [{
    id: 'abc',
    body: 'comment 10',
    asset_id: 'asset',
    author_id: '123',
    status: 'rejected'
  }, {
    id: 'def',
    body: 'comment 20',
    asset_id: 'asset',
    author_id: '456'
  }, {
    id: 'hij',
    body: 'comment 30',
    asset_id: '456',
    status: 'accepted'
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
    item_id: 'abc',
    item_type: 'comment'
  }, {
    action_type: 'like',
    item_id: 'hij',
    item_type: 'comment'
  }];

  beforeEach(() => {
    return Promise.all([
      Comment.create(comments),
      User.createLocalUsers(users),
      Action.create(actions)
    ]);
  });

  it('should return all the pending comments', function(done){
    chai.request(app)
      .get('/api/v1/queue/comments/pending')
      .end(function(err, res){
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body[0]).to.have.property('id', 'def');
        done();
      });
  });

  it('should return all the pending comments as pre moderated', function(done){
    chai.request(app)
      .get('/api/v1/queue/comments/pending')
      .query({'moderation': 'pre'})
      .end(function(err, res){
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body[0]).to.have.property('id', 'def');
        done();
      });
  });

  it('should return all the pending comments as post moderated', function(done){
    chai.request(app)
      .get('/api/v1/queue/comments/pending')
      .query({'moderation': 'post'})
      .end(function(err, res){
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.lengthOf(0);
        done();
      });
  });
});
