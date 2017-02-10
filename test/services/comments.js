const CommentModel = require('../../models/comment');
const ActionModel = require('../../models/action');

const ActionsService = require('../../services/actions');
const UsersService = require('../../services/users');
const SettingsService = require('../../services/settings');
const CommentsService = require('../../services/comments');

const settings = {id: '1', moderation: 'PRE', wordlist: {banned: ['bad words'], suspect: ['suspect words']}};

const expect = require('chai').expect;

describe('services.CommentsService', () => {
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
      type: 'ACCEPTED'
    }],
    status: 'ACCEPTED',
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
      type: 'REJECTED'
    }],
    status: 'REJECTED',
    parent_id: '',
    author_id: '456',
    id: '4'
  }, {
    body: 'comment 50',
    asset_id: '1234',
    status_history: [{
      type: 'PREMOD'
    }],
    status: 'PREMOD',
    parent_id: '',
    author_id: '456',
    id: '5'
  }, {
    body: 'comment 60',
    asset_id: '1234',
    status_history: [{
      type: 'PREMOD'
    }],
    status: 'PREMOD',
    parent_id: '',
    author_id: '456',
    id: '6'
  }];

  const users = [{
    email: 'stampi@gmail.com',
    displayName: 'Stampi',
    password: '1Coral!!',
    roles: ['ADMIN'],
    _id: '1'
  }, {
    email: 'sockmonster@gmail.com',
    displayName: 'Sockmonster',
    password: '2Coral!!',
    _id : '2'
  }];

  const actions = [{
    action_type: 'FLAG',
    item_id: '3',
    item_type: 'COMMENTS',
    user_id: '123'
  }, {
    action_type: 'LIKE',
    item_id: '1',
    item_type: 'COMMENTS',
    user_id: '456'
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

  describe('#publicCreate()', () => {

    it('creates a new comment', () => {
      return CommentsService
        .publicCreate({
          body: 'This is a comment!',
          status: 'ACCEPTED'
        }).then((c) => {
          expect(c).to.not.be.null;
          expect(c.id).to.not.be.null;
          expect(c.id).to.be.uuid;
          expect(c.status).to.be.equal('ACCEPTED');
        });
    });

    it('creates many new comments', () => {
      return CommentsService
        .publicCreate([{
          body: 'This is a comment!',
          status: 'ACCEPTED'
        }, {
          body: 'This is another comment!'
        }, {
          body: 'This is a rejected comment!',
          status: 'REJECTED'
        }]).then(([c1, c2, c3]) => {
          expect(c1).to.not.be.null;
          expect(c1.id).to.be.uuid;
          expect(c1.status).to.be.equal('ACCEPTED');

          expect(c2).to.not.be.null;
          expect(c2.id).to.be.uuid;
          expect(c2.status).to.be.null;

          expect(c3).to.not.be.null;
          expect(c3.id).to.be.uuid;
          expect(c3.status).to.be.equal('REJECTED');
        });
    });

  });

  describe('#findById()', () => {

    it('should find a comment by id', () => {
      return CommentsService
        .findById('1')
        .then((result) => {
          expect(result).to.not.be.null;
          expect(result).to.have.property('body', 'comment 10');
        });
    });

  });

  describe('#findByAssetId()', () => {

    it('should find an array of all comments by asset id', () => {
      return CommentsService
        .findByAssetId('123')
        .then((result) => {
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
      return CommentsService
        .moderationQueue('PREMOD')
        .then((result) => {
          expect(result).to.not.be.null;
          expect(result).to.have.lengthOf(2);
        });
    });

  });

  describe('#removeAction', () => {

    it('should remove an action', () => {
      return CommentsService
        .removeAction('3', '123', 'flag')
          .then(() => {
            return ActionsService.findByItemIdArray(['123']);
          })
          .then((actions) => {
            expect(actions.length).to.equal(0);
          });
    });
  });

  describe('#findByUserId', () => {
    it('should return all comments if admin', () => {
      return CommentsService
        .findByUserId('456', true)
        .then(comments => {
          expect(comments).to.have.length(4);
        });
    });

    it('should not return premod and rejected comments if not admin', () => {
      return CommentsService
        .findByUserId('456')
        .then(comments => {
          expect(comments).to.have.length(1);
        });
    });

  });

  describe('#changeStatus', () => {

    it('should change the status of a comment from no status', () => {
      let comment_id = comments[0].id;

      return CommentsService.findById(comment_id)
        .then((c) => {
          expect(c.status).to.be.null;

          return CommentsService.pushStatus(comment_id, 'REJECTED', '123');
        })
        .then(() => CommentsService.findById(comment_id))
        .then((c) => {
          expect(c).to.have.property('status');
          expect(c.status).to.equal('REJECTED');
          expect(c.status_history).to.have.length(1);
          expect(c.status_history[0]).to.have.property('type', 'REJECTED');
          expect(c.status_history[0]).to.have.property('assigned_by', '123');
        });
    });

    it('should change the status of a comment from accepted', () => {
      return CommentsService.pushStatus(comments[1].id, 'REJECTED', '123')
        .then(() => CommentsService.findById(comments[1].id))
        .then((c) => {
          expect(c).to.have.property('status_history');
          expect(c).to.have.property('status');
          expect(c.status).to.equal('REJECTED');
          expect(c.status_history).to.have.length(2);
          expect(c.status_history[0]).to.have.property('type', 'ACCEPTED');
          expect(c.status_history[0]).to.have.property('assigned_by', null);

          expect(c.status_history[1]).to.have.property('type', 'REJECTED');
          expect(c.status_history[1]).to.have.property('assigned_by', '123');
        });
    });

  });

  describe('#tagByStaff()', () => {

    it('creates a new comment by admin', () => {
      return UsersService.findLocalUser('stampi@gmail.com', '1Coral!!').then((user) => {
        return UsersService.addRoleToUser(user.id, 'ADMIN').then(() => {
          UsersService.findById(user.id).then((u) => {
            return CommentsService
              .publicCreate({
                body: 'This is a comment!',
                status: 'ACCEPTED',
                author_id: u.id
              }).then((c) => {
                expect(c).to.not.be.null;
                expect(c.tags).to.not.have.length(0);
                expect(c.tags[0].name).to.be.equal('STAFF');
              });
          });
        });
      });
    });

    it('creates a new comment by non admin', () => {
      return UsersService.findLocalUser('sockmonster@gmail.com', '2Coral!!').then((user) => {
        return CommentsService
          .publicCreate({
            body: 'This is a comment!',
            status: 'ACCEPTED',
            author_id: user.id
          }).then((c) => {
            expect(c).to.not.be.null;
            expect(c.tags).to.have.length(0);
          });
      });
    });
  });
});
