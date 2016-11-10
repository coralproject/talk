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

describe('Get /comments', () => {
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
    display_name: 'Ana',
  }, {
    id: '456',
    display_name: 'Maria',
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

  it('should return all the comments', function(done){
    chai.request(app)
      .get('/api/v1/comments')
      .end(function(err, res){
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });
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
    id: '123',
    display_name: 'Ana',
  }, {
    id: '456',
    display_name: 'Maria',
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
    return Comment.create(comments).then(() => {
      return User.create(users);
    }).then(() => {
      return Action.create(actions);
    });
  });

  it('should return all the rejected comments', function(done){
    chai.request(app)
      .get('/api/v1/comments/status/rejected')
      .end(function(err, res){
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body[0]).to.have.property('id', 'abc');
        done();
      });
  });

  it('should return all the pending comments', function(done){
    chai.request(app)
      .get('/api/v1/comments/status/pending')
      .end(function(err, res){
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body[0]).to.have.property('id', 'def');
        done();
      });
  });

  it('should return all the pending comments as pre moderated', function(done){
    chai.request(app)
      .get('/api/v1/comments/status/pending')
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
      .get('/api/v1/comments/status/pending')
      .query({'moderation': 'post'})
      .end(function(err, res){
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.lengthOf(0);
        done();
      });
  });

  it('should return all the flagged comments', function(done){
    chai.request(app)
      .get('/api/v1/comments/action/flag')
      .end(function(err, res){
        expect(res).to.have.status(200);
        expect(err).to.be.null;
        expect(res.body.length).to.equal(1);
        expect(res.body[0]).to.have.property('id', 'abc');
        done();
      });
  });
});

describe('Post /comments', () => {
  const users = [{
    id: '123',
    display_name: 'Ana',
  }, {
    id: '456',
    display_name: 'Maria',
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
      .send({'body': 'Something body.', 'author_id': '123', 'asset_id': '1', 'parent_id': ''})
      .end(function(err, res){
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('id');
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
    display_name: 'Ana',
  }, {
    id: '456',
    display_name: 'Maria',
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
    return Comment.create(comments).then(() => {
      return User.create(users);
    }).then(() => {
      return Action.create(actions);
    });
  });

  it('should return the right comment for the comment_id', function(done){
    chai.request(app)
      .get('/api/v1/comments/abc')
      .end(function(err, res){
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.have.property('body');
        expect(res.body).to.have.property('body', 'comment 10');
        done();
      });
  });
});

describe('Put /:comment_id', () => {

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
    display_name: 'Ana',
  }, {
    id: '456',
    display_name: 'Maria',
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

  it('it should update comment', function(done) {
    chai.request(app)
      .post('/api/v1/comments/abc')
      .send({'body': 'Something body.', 'author_id': '123', 'asset_id': '1', 'parent_id': ''})
      .end(function(err, res){
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('body', 'Something body.');
        done();
      });
  });
});

describe('Remove /:comment_id', () => {

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
    display_name: 'Ana',
  }, {
    id: '456',
    display_name: 'Maria',
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

  it('it should remove comment', function(done) {
    chai.request(app)
      .delete('/api/v1/comments/abc')
      .end(function(err, res){
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        Comment.findById('abc').then((comment) => {
          expect(comment).to.be.empty;
        });
        done();
      });
  });
});

describe('Post /:comment_id/status', () => {

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
    id: '123',
    display_name: 'Ana',
  }, {
    id: '456',
    display_name: 'Maria',
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

  it('it should update status', function(done) {
    chai.request(app)
      .post('/api/v1/comments/abc/status')
      .send({'status': 'accepted'})
      .end(function(err, res){
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.have.body;
        expect(res.body).to.have.property('status', 'accepted');
        done();
      });
  });
});

describe('Post /:comment_id/actions', () => {

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
    id: '123',
    display_name: 'Ana',
  }, {
    id: '456',
    display_name: 'Maria',
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

  it('it should update actions', function(done) {
    chai.request(app)
      .post('/api/v1/comments/abc/actions')
      .send({'user_id': '456', 'action_type': 'flag'})
      .end(function(err, res){
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.have.body;
        expect(res.body).to.have.property('item_type', 'comment');
        expect(res.body).to.have.property('action_type', 'flag');
        expect(res.body).to.have.property('item_id', 'abc');
        expect(res.body).to.have.property('user_id', '456');
        done();
      });
  });
});
