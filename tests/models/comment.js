const Comment = require('../../models/comment');
const User = require('../../models/user');
const Action = require('../../models/action');
const Setting = require('../../models/setting');

const settings = {id: '1', moderation: 'pre'};

const expect = require('chai').expect;

describe('Comment: models', () => {
  const comments = [{
    body: 'comment 10',
    asset_id: '123',
    status: '',
    parent_id: '',
    author_id: '123',
    id: '1'
  }, {
    body: 'comment 20',
    asset_id: '123',
    status: 'accepted',
    parent_id: '',
    author_id: '123',
    id: '2'
  }, {
    body: 'comment 30',
    asset_id: '456',
    status: '',
    parent_id: '',
    author_id: '456',
    id: '3'
  }, {
    body: 'comment 40',
    asset_id: '123',
    status: 'rejected',
    parent_id: '',
    author_id: '456',
    id: '4'
  }];

  const users = [{
    email: 'stampi@gmail.com',
    displayName: 'Stampi',
    password: '1Coral!'
  }, {
    email: 'sockmonster@gmail.com',
    displayName: 'Sockmonster',
    password: '2Coral!'
  }];

  const actions = [{
    action_type: 'flag',
    item_id: '3',
    item_type: 'comment',
    user_id: '123'
  }, {
    action_type: 'like',
    item_id: '1',
    item_type: 'comment',
    user_id: '456'
  }];

  beforeEach(() => {
    return Promise.all([
      Setting.create(settings),
      Comment.create(comments),
      User.createLocalUsers(users),
      Action.create(actions)
    ]);
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
    it('should find an array of accepted comments by asset id', () => {
      return Comment.findAcceptedByAssetId('123').then((result) => {
        expect(result).to.have.length(1);
        result.sort((a, b) => {
          if (a.body < b.body) {return -1;}
          else {return 1;}
        });
        expect(result[0]).to.have.property('body', 'comment 20');
      });
    });
    it('should find an array of new and accepted comments by asset id', () => {
      return Comment.findAcceptedAndNewByAssetId('123').then((result) => {
        expect(result).to.have.length(2);
        result.sort((a, b) => {
          if (a.body < b.body) {return -1;}
          else {return 1;}
        });
        expect(result[0]).to.have.property('body', 'comment 10');
      });
    });
  });
  describe('#moderationQueue()', () => {
    it('should find an array of new comments to moderate when pre-moderation', () => {
      return Comment.moderationQueue('pre').then((result) => {
        expect(result).to.not.be.null;
        expect(result).to.have.lengthOf(2);
      });
    });
    it('should find an array of new comments to moderate when post-moderation', () => {
      return Comment.moderationQueue('post').then((result) => {
        expect(result).to.not.be.null;
        expect(result).to.have.lengthOf(1);
        expect(result[0]).to.have.property('body', 'comment 30');
      });
    });
    // it('should fail when the moderation is not pre or post', () => {
    //   return Comment.moderationQueue('any').catch(function(error) {
    //     expect(error).to.not.be.null;
    //   });
    // });
  });

  describe('#removeAction', () => {
    it('should remove an action', () => {
      return Comment.removeAction('3', '123', 'flag').then(() => {
        return Action.findByItemIdArray(['123']);
      })
      .then((actions) => {
        expect(actions.length).to.equal(0);
      });
    });
  });
});
