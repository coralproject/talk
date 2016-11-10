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
    return Setting.create(settings).then(() => {
      return Comment.create(comments).then(() => {
        return User.create(users);
      }).then(() => {
        return Action.create(actions);
      });
    });
  });

  it('should return a stream with comments, users and actions', function(done){
    chai.request(app)
      .get('/api/v1/stream')
      .query({'asset_id': 'asset'})
      .end(function(err, res){
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.length).to.equal(3);
        done();
      });
  });
});
