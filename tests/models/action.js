require('../utils/mongoose');

const Action = require('../../models/action');
const expect = require('chai').expect;

describe('Action: models', () => {
  let mockActions;
  beforeEach(() => {
    return Action.create([{
      action_type: 'flag',
      item_id: '123'
    }, {
      action_type: 'like',
      item_id: '789'
    }, {
      action_type: 'flag',
      item_id: '456'
    }, {
      action_type: 'flag',
      item_id: '123'
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
        expect(result).to.have.length(3);
      });
    });
  });

  describe('#getActionSummaries()', () => {
    it('should return properly formatted summaries from an array of item_ids', () => {
      return Action.getActionSummaries(['123', '789']).then((result) => {
        expect(result).to.have.length(2);
        const sorted = result.sort((a, b) => a.count - b.count);
        expect(sorted[0]).to.deep.equal({
          type: 'like',
          count: 1,
          item_id: '789',
          current_user: false
        });
        expect(sorted[1]).to.deep.equal({
          type: 'flag',
          count: 2,
          item_id: '123',
          current_user: false
        });
      });
    });
  });
});
