require('../utils/mongoose');

const Action = require('../../models/action');
const expect = require('chai').expect;

describe('Action: models', () => {
  let mockActions;
  beforeEach(() => {
    return Action.create([{
      action_type: 'flag',
      item_id: '123',
      item_type: 'comments'
    }, {
      action_type: 'like',
      item_id: '789',
      item_type: 'comments'
    }, {
      action_type: 'flag',
      item_id: '456',
      item_type: 'comments'
    }, {
      action_type: 'flag',
      item_id: '123',
      item_type: 'comments'
    }, {
      action_type: 'like',
      item_id: '123',
      item_type: 'comments'
    }, {
      action_type: 'like',
      item_id: '999',
      item_type: 'comments',
      user_id: 'a-user-id'
    }]).then((actions) => {
      mockActions = actions;
    });
  });

  describe('#findById()', () => {
    it('should find an action by id', () => {
      return Action.findById(mockActions[0].id).then((result) => {
        expect(result).to.have.property('action_type')
          .and.to.equal('flag');
      });
    });
  });

  describe('#findByItemIdArray()', () => {
    it('should find an array of actions from an array of item_ids', () => {
      return Action.findByItemIdArray(['123', '456']).then((result) => {
        expect(result).to.have.length(4);
      });
    });
  });

  describe('#getActionSummaries()', () => {
    it('should return properly formatted summaries from an array of item_ids', () => {
      return Action
        .getActionSummaries(['123', '789'])
        .then((result) => {
          expect(result).to.have.length(3);

          expect(result).to.include({
            action_type: 'like',
            count: 1,
            item_id: '789',
            item_type: 'comments',
            current_user: false
          });

          expect(result).to.include({
            action_type: 'like',
            count: 1,
            item_id: '123',
            item_type: 'comments',
            current_user: false
          });

          expect(result).to.include({
            action_type: 'flag',
            count: 2,
            item_id: '123',
            item_type: 'comments',
            current_user: false
          });
        });
    });

    it('should return the action for the user', () => {
      return Action
        .getActionSummaries(['999'], 'a-user-id')
        .then((actions) => {
          expect(actions).to.have.length(1);

          const action = actions[0];

          expect(action).to.have.property('current_user');
          expect(action.current_user).to.not.be.false;
        });
    });
  });
});
