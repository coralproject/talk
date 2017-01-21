const passport = require('../../../passport');

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
const settings = {id: '1', moderation: 'pre', wordlist: {banned: ['banned'], suspect: ['suspect']}};

describe('/api/v1/queue', () => {
  const comments = [{
    id: 'abc',
    body: 'comment 10',
    asset_id: 'asset',
    author_id: '123',
    status: 'rejected',
    status_history: [{
      type: 'rejected'
    }]
  }, {
    id: 'def',
    body: 'comment 20',
    asset_id: 'asset',
    author_id: '456',
    status: 'premod',
    status_history: [{
      type: 'premod'
    }]
  }, {
    id: 'hij',
    body: 'comment 30',
    asset_id: '456',
    status: 'accepted',
    status_history: [{
      type: 'accepted'
    }]
  }];

  const users = [{
    displayName: 'Ana',
    email: 'ana@gmail.com',
    password: '123456789'
  }, {
    displayName: 'Maria',
    email: 'maria@gmail.com',
    password: '123456789'
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
    return Setting.init(settings).then(() => {
      return User.createLocalUsers(users)
        .then((u) => {
          comments[0].author_id = u[0].id;
          comments[1].author_id = u[1].id;
          comments[2].author_id = u[1].id;

          return Comment.create(comments);
        })
        .then((c) => {
          actions[0].item_id = c[0].id;
          actions[1].item_id = c[1].id;

          return Promise.all([
            Action.create(actions),
            Setting.init(settings)
          ]);
        });
    });
  });

  it('should return all the pending comments, users and actions', () => {
    return chai.request(app)
      .get('/api/v1/queue/comments/pending')
      .set(passport.inject({roles: ['admin']}))
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body.comments).to.have.length(1);
        expect(res.body.comments[0]).to.have.property('body');
        expect(res.body.users[0]).to.have.property('displayName');
        expect(res.body.actions[0]).to.have.property('action_type');
      });
  });
});
