const Comment = require('../../models/comment');
const User = require('../../models/user');
const Action = require('../../models/action');
const Setting = require('../../models/setting');

const settings = {id: '1', moderation: 'pre', wordlist: {banned: ['bad words'], suspect: ['suspect words']}};

const expect = require('chai').expect;

describe('models.Comment', () => {
  const comments = [{
    body: 'comment 10',
    asset_id: '123',
    status_history: [],
    parent_id: '',
    author_id: '123',
    id: '1'
  }, {
    body: 'comment 20',
    asset_id: '123',
    status_history: [{
      type: 'accepted'
    }],
    status: 'accepted',
    parent_id: '',
    author_id: '123',
    id: '2'
  }, {
    body: 'comment 30',
    asset_id: '456',
    status_history: [],
    parent_id: '',
    author_id: '456',
    id: '3'
  }, {
    body: 'comment 40',
    asset_id: '123',
    status_history: [{
      type: 'rejected'
    }],
    status: 'rejected',
    parent_id: '',
    author_id: '456',
    id: '4'
  }, {
    body: 'comment 50',
    asset_id: '1234',
    status_history: [{
      type: 'premod'
    }],
    status: 'premod',
    parent_id: '',
    author_id: '456',
    id: '5'
  }, {
    body: 'comment 60',
    asset_id: '1234',
    status_history: [{
      type: 'premod'
    }],
    status: 'premod',
    parent_id: '',
    author_id: '456',
    id: '6'
  }];

  const users = [{
    email: 'stampi@gmail.com',
    displayName: 'Stampi',
    password: '1Coral!!'
  }, {
    email: 'sockmonster@gmail.com',
    displayName: 'Sockmonster',
    password: '2Coral!!'
  }];

  const actions = [{
    action_type: 'flag',
    item_id: '3',
    item_type: 'comments',
    user_id: '123'
  }, {
    action_type: 'like',
    item_id: '1',
    item_type: 'comments',
    user_id: '456'
  }];

  beforeEach(() => {
    return Setting.init(settings).then(() => {
      return Promise.all([
        Comment.create(comments),
        User.createLocalUsers(users),
        Action.create(actions)
      ]);
    });
  });

  describe('#publicCreate()', () => {

    it('creates a new comment', () => {
      return Comment.publicCreate({
        body: 'This is a comment!',
        status: 'accepted'
      }).then((c) => {
        expect(c).to.not.be.null;
        expect(c.id).to.not.be.null;
        expect(c.id).to.be.uuid;
        expect(c.status).to.be.equal('accepted');
      });
    });

    it('creates many new comments', () => {
      return Comment.publicCreate([{
        body: 'This is a comment!',
        status: 'accepted'
      }, {
        body: 'This is another comment!'
      }, {
        body: 'This is a rejected comment!',
        status: 'rejected'
      }]).then(([c1, c2, c3]) => {
        expect(c1).to.not.be.null;
        expect(c1.id).to.be.uuid;
        expect(c1.status).to.be.equal('accepted');

        expect(c2).to.not.be.null;
        expect(c2.id).to.be.uuid;
        expect(c2.status).to.be.null;

        expect(c3).to.not.be.null;
        expect(c3.id).to.be.uuid;
        expect(c3.status).to.be.equal('rejected');
      });
    });

  });

  describe('#findById()', () => {

    it('should find a comment by id', () => {
      return Comment.findById('1').then((result) => {
        expect(result).to.not.be.null;
        expect(result).to.have.property('body', 'comment 10');
      });
    });

  });

  describe('#findByAssetId()', () => {

    it('should find an array of all comments by asset id', () => {
      return Comment.findByAssetId('123').then((result) => {
        expect(result).to.have.length(3);
        result.sort((a, b) => {
          if (a.body < b.body) {return -1;}
          else {return 1;}
        });
        expect(result[0]).to.have.property('body', 'comment 10');
        expect(result[1]).to.have.property('body', 'comment 20');
        expect(result[2]).to.have.property('body', 'comment 40');
      });
    });
  });

  describe('#moderationQueue()', () => {

    it('should find an array of new comments to moderate when pre-moderation', () => {
      return Comment.moderationQueue('premod').then((result) => {
        expect(result).to.not.be.null;
        expect(result).to.have.lengthOf(2);
      });
    });

  });

  describe('#removeAction', () => {

    it('should remove an action', () => {
      return Comment.removeAction('3', '123', 'flag')
        .then(() => {
          return Action.findByItemIdArray(['123']);
        })
        .then((actions) => {
          expect(actions.length).to.equal(0);
        });
    });
  });

  describe('#changeStatus', () => {

    it('should change the status of a comment from no status', () => {
      let comment_id = comments[0].id;

      return Comment.findById(comment_id)
        .then((c) => {
          expect(c.status).to.be.null;

          return Comment.pushStatus(comment_id, 'rejected', '123');
        })
        .then(() => Comment.findById(comment_id))
        .then((c) => {
          expect(c).to.have.property('status');
          expect(c.status).to.equal('rejected');
          expect(c.status_history).to.have.length(1);
          expect(c.status_history[0]).to.have.property('type', 'rejected');
          expect(c.status_history[0]).to.have.property('assigned_by', '123');
        });
    });

    it('should change the status of a comment from accepted', () => {
      return Comment.pushStatus(comments[1].id, 'rejected', '123')
        .then(() => Comment.findById(comments[1].id))
        .then((c) => {
          expect(c).to.have.property('status_history');
          expect(c).to.have.property('status');
          expect(c.status).to.equal('rejected');
          expect(c.status_history).to.have.length(2);
          expect(c.status_history[0]).to.have.property('type', 'accepted');
          expect(c.status_history[0]).to.have.property('assigned_by', null);

          expect(c.status_history[1]).to.have.property('type', 'rejected');
          expect(c.status_history[1]).to.have.property('assigned_by', '123');
        });
    });

  });
});
