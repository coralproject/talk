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
        expect(res).to.have.status(200);
        done();
      });
  });
});

describe('Delete /:comment_id', () => {

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
        expect(res).to.have.status(201);
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
        done();
      });
  });
});
