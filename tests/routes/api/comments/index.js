const passport = require('../../../passport');

const app = require('../../../../app');
const chai = require('chai');
const expect = chai.expect;

// Setup chai.
chai.should();
chai.use(require('chai-http'));

const wordlist = require('../../../../services/wordlist');
const Comment = require('../../../../models/comment');
const Asset = require('../../../../models/asset');
const Action = require('../../../../models/action');
const User = require('../../../../models/user');

const Setting = require('../../../../models/setting');
const settings = {id: '1', moderation: 'pre'};

describe('/api/v1/comments', () => {

  // Ensure that the settings are always available.
  beforeEach(() => Promise.all([
    wordlist.insert(['bad words']),
    Setting.init(settings)
  ]));

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
      status_history: [{
        type: 'rejected'
      }]
    }, {
      body: 'comment 30',
      asset_id: '456',
      status_history: [{
        type: 'accepted'
      }]
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
        Comment.create(comments).then((newComments) => {
          newComments.forEach((comment, i) => {
            comments[i].id = comment.id;
          });

          actions[0].item_id = comments[0].id;
          actions[1].item_id = comments[1].id;

          return Action.create(actions);
        }),
        User.createLocalUsers(users)
      ]);
    });

    it('should return only the owner’s comments if the user is not an admin', () => {
      return chai.request(app)
        .get('/api/v1/comments?user_id=456')
        .set(passport.inject({id: '456', roles: []}))
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body.comments).to.have.length(2);
          expect(res.body.comments[1]).to.have.property('author_id', '456');
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
          expect(err).to.have.property('status', 401);
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
        .get('/api/v1/comments?status=rejected')
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
        .get('/api/v1/comments?status=accepted')
        .set(passport.inject({roles: ['admin']}))
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body.comments).to.have.length(1);
          expect(res.body.comments[0]).to.have.property('id', comments[3].id);
        });
    });

    it('should return all the new comments', () => {
      return chai.request(app)
        .get('/api/v1/comments?status=new')
        .set(passport.inject({roles: ['admin']}))
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body.comments).to.have.length(2);
        });
    });

    it('should return all the flagged comments', () => {
      return chai.request(app)
        .get('/api/v1/comments?action_type=flag')
        .set(passport.inject({roles: ['admin']}))
        .then((res) => {
          expect(res).to.have.status(200);

          expect(res.body.comments).to.have.length(1);
          expect(res.body.comments[0]).to.have.property('id', comments[0].id);
        });
    });
  });

  describe('#post', () => {

    let asset_id;

    beforeEach(() => Asset.findOrCreateByUrl('https://coralproject.net/section/article-is-the-best').then((asset) => {

      // Update the asset id.
      asset_id = asset.id;
    }));

    it('should create a comment', () => {
      return chai.request(app)
        .post('/api/v1/comments')
        .set(passport.inject({roles: []}))
        .send({'body': 'Something body.', 'author_id': '123', 'asset_id': asset_id, 'parent_id': ''})
        .then((res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('id');
        });
    });

    it('should create a comment with a rejected status if it contains a bad word', () => {
      return chai.request(app)
        .post('/api/v1/comments')
        .set(passport.inject({roles: []}))
        .send({'body': 'bad words are the baddest', 'author_id': '123', 'asset_id': asset_id, 'parent_id': ''})
        .then((res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('id');
          expect(res.body).to.have.property('status', 'rejected');
        });
    });

    it('should create a comment with a premod status if it\'s asset is has pre-moderation enabled', () => {
      return Asset
        .findOrCreateByUrl('https://coralproject.net/article1')
        .then((asset) => {
          return Asset
            .overrideSettings(asset.id, {moderation: 'pre'})
            .then(() => asset);
        })
        .then((asset) => {
          return chai.request(app)
            .post('/api/v1/comments')
            .set(passport.inject({roles: []}))
            .send({'body': 'Something body.', 'author_id': '123', 'asset_id': asset.id, 'parent_id': ''});
        })
        .then((res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('id');
          expect(res.body).to.have.property('asset_id');
          expect(res.body).to.have.property('status', 'premod');
        });
    });

    it('should create a rejected comment if the body is above the character count', () => {
      return Asset
        .findOrCreateByUrl('https://coralproject.net/article1')
        .then((asset) => {
          return Asset
            .overrideSettings(asset.id, {charCountEnable: true, charCount: 10})
            .then(() => asset);
        })
        .then((asset) => {
          return chai.request(app)
            .post('/api/v1/comments')
            .set(passport.inject({roles: []}))
            .send({'body': 'This is way way way way way too long.', 'author_id': '123', 'asset_id': asset.id, 'parent_id': ''});
        })
        .then((res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('id');
          expect(res.body).to.have.property('asset_id');
          expect(res.body).to.have.property('status', 'rejected');
        });
    });

    it('shouldn\'t create a comment when the asset has expired commenting', () => {
      return Asset.create({
        closedAt: new Date().setDate(0),
        closedMessage: 'tests said expired!'
      })
      .then((asset) => {
        return chai.request(app)
          .post('/api/v1/comments')
          .set(passport.inject({roles: []}))
          .send({'body': 'Something body.', 'author_id': '123', 'asset_id': asset.id, 'parent_id': ''});
      })
      .then((res) => {
        expect(res).to.have.status(500);
      })
      .catch((err) => {
        expect(err.response.body).to.not.be.null;
        expect(err.response.body).to.have.property('message');
        expect(err.response.body.message).to.contain('tests said expired!');
      });
    });

    it('should create a comment when the asset has not expired yet', () => {
      return Asset.create({
        closedAt: new Date().setDate(32),
        closedMessage: 'tests said expired!'
      })
      .then((asset) => {
        return chai.request(app)
          .post('/api/v1/comments')
          .set(passport.inject({roles: []}))
          .send({'body': 'Something body.', 'author_id': '123', 'asset_id': asset.id, 'parent_id': ''});
      })
      .then((res) => {
        expect(res).to.have.status(201);
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

          return Comment.findById('abc');
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
    status_history: [{
      type: 'rejected'
    }]
  }, {
    id: 'hij',
    body: 'comment 30',
    asset_id: '456',
    status_history: [{
      type: 'accepted'
    }]
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

  describe('#post', () => {
    it('it should update actions', () => {
      return chai.request(app)
        .post('/api/v1/comments/abc/actions')
        .set(passport.inject({id: '456', roles: ['admin']}))
        .send({'action_type': 'flag', 'detail': 'Comment is too awesome.'})
        .then((res) => {
          expect(res).to.have.status(201);
          expect(res).to.have.body;
          expect(res.body).to.have.property('action_type', 'flag');
          expect(res.body).to.have.property('detail', 'Comment is too awesome.');
          expect(res.body).to.have.property('item_id', 'abc');
        });
    });
  });
});
