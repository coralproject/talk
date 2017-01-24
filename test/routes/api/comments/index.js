const passport = require('../../../passport');

const app = require('../../../../app');
const chai = require('chai');
const expect = chai.expect;

// Setup chai.
chai.should();
chai.use(require('chai-http'));

const CommentModel = require('../../../../models/comment');
const ActionModel = require('../../../../models/action');

const CommentsService = require('../../../../services/comments');
const UsersService = require('../../../../services/users');
const SettingsService = require('../../../../services/settings');

const settings = {id: '1', moderation: 'pre', wordlist: {banned: ['bad words'], suspect: ['suspect words']}};

describe('/api/v1/comments', () => {

  // Ensure that the settings are always available.
  beforeEach(() => SettingsService.init(settings));

  describe('#get', () => {
    const comments = [{
      body: 'comment 10',
      asset_id: 'asset',
      author_id: '123'
    }, {
      body: 'comment 20',
      asset_id: 'asset',
      author_id: '456'
    }, {
      body: 'comment 20',
      asset_id: 'asset',
      author_id: '456',
      status: 'REJECTED',
      status_history: [{
        type: 'REJECTED'
      }]
    }, {
      body: 'comment 30',
      asset_id: '456',
      status: 'ACCEPTED',
      status_history: [{
        type: 'ACCEPTED'
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
      action_type: 'FLAG',
      item_id: 'abc',
      item_type: 'COMMENTS'
    }, {
      action_type: 'LIKE',
      item_id: 'hij',
      item_type: 'COMMENTS'
    }];

    beforeEach(() => {
      return Promise.all([
        CommentModel.create(comments).then((newComments) => {
          newComments.forEach((comment, i) => {
            comments[i].id = comment.id;
          });

          actions[0].item_id = comments[0].id;
          actions[1].item_id = comments[1].id;

          return ActionModel.create(actions);
        }),
        UsersService.createLocalUsers(users)
      ]);
    });

    it('should return only the owner’s published comments if the user is not an admin', () => {
      return chai.request(app)
        .get('/api/v1/comments?user_id=456')
        .set(passport.inject({id: '456', roles: []}))
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body.comments).to.have.length(1);
          expect(res.body.comments[0]).to.have.property('author_id', '456');
        });
    });

    it('should fail if a non-admin requests comments not owned by them', () => {
      return chai.request(app)
        .get('/api/v1/comments?user_id=456')
        .set(passport.inject({id: '123', roles: []}))
        .then((res) => {
          expect(res).to.be.empty;
        })
        .catch((err) => {
          expect(err).to.have.status(401);
        });
    });

    it('should return all the comments', () => {
      return chai.request(app)
        .get('/api/v1/comments')
        .set(passport.inject({roles: ['admin']}))
        .then((res) => {

          expect(res).to.have.status(200);

        });
    });

    it('should return all the rejected comments', () => {
      return chai.request(app)
        .get('/api/v1/comments?status=REJECTED')
        .set(passport.inject({roles: ['admin']}))
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('comments');
          expect(res.body.comments).to.have.length(1);
          expect(res.body.comments[0]).to.have.property('id', comments[2].id);
        });
    });

    it('should return all the approved comments', () => {
      return chai.request(app)
        .get('/api/v1/comments?status=ACCEPTED')
        .set(passport.inject({roles: ['admin']}))
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body.comments).to.have.length(1);
          expect(res.body.comments[0]).to.have.property('id', comments[3].id);
        });
    });

    it('should return all the new comments', () => {
      return chai.request(app)
        .get('/api/v1/comments?status=NEW')
        .set(passport.inject({roles: ['admin']}))
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body.comments).to.have.length(2);
        });
    });

    it('should return all the flagged comments', () => {
      return chai.request(app)
        .get('/api/v1/comments?action_type=FLAG')
        .set(passport.inject({roles: ['admin']}))
        .then((res) => {
          expect(res).to.have.status(200);

          expect(res.body.comments).to.have.length(1);
          expect(res.body.comments[0]).to.have.property('id', comments[0].id);
        });
    });
  });
});

describe('/api/v1/comments/:comment_id', () => {
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
    password: '123456789'
  }, {
    displayName: 'Maria',
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
  }];

  beforeEach(() => {
    return SettingsService.init(settings).then(() => {
      return Promise.all([
        CommentModel.create(comments),
        UsersService.createLocalUsers(users),
        ActionModel.create(actions)
      ]);
    });
  });

  describe('#get', () => {

    it('should return the right comment for the comment_id', () => {
      return chai.request(app)
        .get('/api/v1/comments/abc')
        .set(passport.inject({roles: ['admin']}))
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.have.property('body');
          expect(res.body).to.have.property('body', 'comment 10');
        });
    });
  });

  describe('#delete', () => {
    it('it should remove comment', () => {
      return chai.request(app)
        .delete('/api/v1/comments/abc')
        .set(passport.inject({roles: ['admin']}))
        .then((res) => {
          expect(res).to.have.status(204);
          return CommentsService.findById('abc');
        })
        .then((comment) => {
          expect(comment).to.be.null;
        });
    });
  });

  describe('#put', () => {
    it('it should update status', function() {
      return chai.request(app)
        .put('/api/v1/comments/abc/status')
        .set(passport.inject({roles: ['admin']}))
        .send({status: 'accepted'})
        .then((res) => {
          expect(res).to.have.status(204);
          expect(res.body).to.be.empty;
        });
    });

    it('it should not allow a non-admin to update status', () => {
      return chai.request(app)
        .put('/api/v1/comments/abc/status')
        .set(passport.inject({roles: []}))
        .send({status: 'accepted'})
        .then((res) => {
          expect(res).to.be.empty;
        })
        .catch((err) => {
          expect(err).to.have.property('status', 401);
        });
    });
  });
});

describe('/api/v1/comments/:comment_id/actions', () => {

  const comments = [{
    id: 'abc',
    body: 'comment 10',
    asset_id: 'asset',
    author_id: '123',
    status_history: []
  }, {
    id: 'def',
    body: 'comment 20',
    asset_id: 'asset',
    author_id: '456',
    status: 'REJECTED',
    status_history: [{
      type: 'REJECTED'
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
    displayName: 'Ana',
    email: 'ana@gmail.com',
    password: '123456789'
  }, {
    displayName: 'Maria',
    email: 'maria@gmail.com',
    password: '123456789'
  }];

  const actions = [{
    action_type: 'FLAG',
    item_type: 'COMMENTS',
    item_id: 'abc'
  }, {
    action_type: 'LIKE',
    item_type: 'COMMENTS',
    item_id: 'hij'
  }];

  beforeEach(() => {
    return SettingsService.init(settings).then(() => {
      return Promise.all([
        CommentModel.create(comments),
        UsersService.createLocalUsers(users),
        ActionModel.create(actions)
      ]);
    });
  });

  describe('#post', () => {
    it('it should create an action', () => {
      return chai.request(app)
        .post('/api/v1/comments/abc/actions')
        .set(passport.inject({id: '456', roles: ['admin']}))
        .send({'action_type': 'flag', 'metadata': {'reason': 'Comment is too awesome.'}})
        .then((res) => {
          expect(res).to.have.status(201);
          expect(res).to.have.body;

          expect(res.body).to.have.property('action_type', 'flag');
          expect(res.body).to.have.property('metadata');
          expect(res.body.metadata).to.deep.equal({'reason': 'Comment is too awesome.'});
          expect(res.body).to.have.property('item_id', 'abc');
        });
    });
  });
});
