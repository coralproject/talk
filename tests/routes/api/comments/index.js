const passport = require('../../../passport');

const app = require('../../../../app');
const chai = require('chai');
const expect = chai.expect;

// Setup chai.
chai.should();
chai.use(require('chai-http'));

const wordlist = require('../../../../services/wordlist');
const Comment = require('../../../../models/comment');
const Action = require('../../../../models/action');
const User = require('../../../../models/user');

const Setting = require('../../../../models/setting');
const settings = {id: '1', moderation: 'pre'};

describe('/api/v1/comments', () => {
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
    id: 'def-rejected',
    body: 'comment 20',
    asset_id: 'asset',
    author_id: '456',
    status: 'rejected'
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
      Action.create(actions),
      wordlist.insert([
        'bad words'
      ]),
      Setting.create(settings)
    ]);
  });

  describe('#get', () => {
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
          expect(res.body[0]).to.have.property('id', 'def-rejected');
        });
    });

    it('should return all the approved comments', () => {
      return chai.request(app)
        .get('/api/v1/comments?status=accepted')
        .set(passport.inject({roles: ['admin']}))
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.length(1);
          expect(res.body[0]).to.have.property('id', 'hij');
        });
    });

    it('should return all the new comments', () => {
      return chai.request(app)
        .get('/api/v1/comments?status=new')
        .set(passport.inject({roles: ['admin']}))
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.length(2);
        });
    });

    it('should return all the flagged comments', () => {
      return chai.request(app)
        .get('/api/v1/comments?action_type=flag')
        .set(passport.inject({roles: ['admin']}))
        .then((res) => {
          expect(res).to.have.status(200);

          expect(res.body).to.have.length(1);
          expect(res.body[0]).to.have.property('id', 'abc');

        });
    });
  });

  describe('#post', () => {

    it('should create a comment', () => {
      return chai.request(app)
        .post('/api/v1/comments')
        .set(passport.inject({roles: []}))
        .send({'body': 'Something body.', 'author_id': '123', 'asset_id': '1', 'parent_id': ''})
        .then((res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('id');
        });
    });

    it('should create a comment with a rejected status if it contains a bad word', () => {
      return chai.request(app)
        .post('/api/v1/comments')
        .set(passport.inject({roles: []}))
        .send({'body': 'bad words are the baddest', 'author_id': '123', 'asset_id': '1', 'parent_id': ''})
        .then((res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('id');
          expect(res.body).to.have.property('status', 'rejected');
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
    status: ''
  }, {
    id: 'def',
    body: 'comment 20',
    asset_id: 'asset',
    author_id: '456',
    status: 'rejected'
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
        .send({'user_id': '456', 'action_type': 'flag'})
        .then((res) => {
          expect(res).to.have.status(201);
          expect(res).to.have.body;
          expect(res.body).to.have.property('item_type', 'comment');
          expect(res.body).to.have.property('action_type', 'flag');
          expect(res.body).to.have.property('item_id', 'abc');
          expect(res.body).to.have.property('user_id', '456');
        });
    });
  });
});
