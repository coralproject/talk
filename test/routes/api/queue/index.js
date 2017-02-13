const passport = require('../../../passport');

const app = require('../../../../app');
const chai = require('chai');
const expect = chai.expect;

// Setup chai.
chai.should();
chai.use(require('chai-http'));

const Comment = require('../../../../models/comment');
const Action = require('../../../../models/action');
const UsersService = require('../../../../services/users');

const SettingsService = require('../../../../services/settings');
const settings = {id: '1', moderation: 'PRE', wordlist: {banned: ['banned'], suspect: ['suspect']}};

describe('/api/v1/queue', () => {
  const comments = [{
    id: 'abc',
    body: 'comment 10',
    asset_id: 'asset',
    author_id: '123',
    status: 'REJECTED',
    status_history: [{
      type: 'REJECTED'
    }]
  }, {
    id: 'def',
    body: 'comment 20',
    asset_id: 'asset',
    author_id: '456',
    status: 'PREMOD',
    status_history: [{
      type: 'PREMOD'
    }]
  }, {
    id: 'hij',
    body: 'comment 30',
    asset_id: '456',
    status: 'ACCEPTED',
    status_history: [{
      type: 'ACCEPTED'
    }]
  }];

  const users = [{
    username: 'Ana',
    email: 'ana@gmail.com',
    password: '123456789'
  }, {
    username: 'Maria',
    email: 'maria@gmail.com',
    password: '123456789'
  }];

  const actions = [{
    action_type: 'FLAG',
    item_id: 'abc',
    item_type: 'COMMENTS'
  }, {
    action_type: 'LIKE',
    item_id: 'hij',
    item_type: 'COMMENTS'
  }, {
    action_type: 'FLAG',
    item_id: '123',
    item_type: 'USERS'
  }];

  beforeEach(() => {
    return SettingsService.init(settings).then(() => {
      return UsersService.createLocalUsers(users)
        .then((u) => {
          comments[0].author_id = u[0].id;
          comments[1].author_id = u[1].id;
          comments[2].author_id = u[1].id;

          return Promise.all([
            Comment.create(comments),
            u,
            ...u.map((user) => UsersService.setStatus(user.id, 'PENDING'))
          ]);
        })
        .then(([c, u]) => {
          actions[0].item_id = c[0].id;
          actions[1].item_id = c[1].id;
          actions[2].item_id = u[0].id;

          return Promise.all([
            Action.create(actions),
            SettingsService.init(settings)
          ]);
        });
    });
  });

  it('should return all the pending comments, users and actions', () => {
    return chai.request(app)
      .get('/api/v1/queue/comments/premod')
      .set(passport.inject({roles: ['ADMIN']}))
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body.comments).to.have.length(1);
        expect(res.body.comments[0]).to.have.property('body');
        expect(res.body.users[0]).to.have.property('username');
        expect(res.body.actions[0]).to.have.property('action_type');
      });
  });

  it('should return all pending users and actions', function(done){
    chai.request(app)
      .get('/api/v1/queue/users/flagged')
      .set(passport.inject({roles: ['ADMIN']}))
      .end(function(err, res){
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.users[0]).to.have.property('username');
        expect(res.body.actions[0]).to.have.property('action_type');
        done();
      });
  });
});
