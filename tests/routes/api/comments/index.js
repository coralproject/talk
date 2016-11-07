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

describe('Post /comments', () => {
  const users = [{
    id: '123',
    display_name: 'John',
  }, {
    id: '456',
    display_name: 'Paul',
  }];

  const actions = [{
    action_type: 'flag',
    item_id: 'abc'
  }, {
    action_type: 'like',
    item_id: 'hij'
  }];

  beforeEach(() => {
    return User.create(users).then(() => {
      return Action.create(actions);
    });
  });

  it('it should create a comment', function(done) {
    chai.request(app)
      .post('/api/v1/comments')
      .query({'body': 'Something body.', 'author_id': '123', 'asset_id': '1', 'parent_id': ''})
      .end(function(err, res){
        expect(res).to.have.status(201);
        done();
      });
  });

});

describe('Get /:comment_id', () => {
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
    id: '123',
    display_name: 'John',
  }, {
    id: '456',
    display_name: 'Paul',
  }];

  const actions = [{
    action_type: 'flag',
    item_id: 'abc'
  }, {
    action_type: 'like',
    item_id: 'hij'
  }];

  beforeEach(() => {
    return Comment.create(comments).then(() => {
      return User.create(users);
    }).then(() => {
      return Action.create(actions);
    });
  });

  it('should return the right comment for the comment_id', function(done){
    chai.request(app)
      .get('/api/v1/comments')
      .query({'comment_id': 'abc'})
      .end(function(err, res){
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        if (err) {return done(err);}
        done();
      });
  });
});
