/* eslint-env node, mocha */

require('../utils/mongoose');
const Action = require('../../models/action');
const expect = require('chai').expect;

describe('Action: models', () => {
  var mockActions;
  beforeEach(() => {
    return Action.create([{
      action_type: 'flag',
      item_id: '123'
    },{
      action_type: 'like',
      item_id: '789'
    },{
      action_type: 'flag',
      item_id: '456'
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
      return Action.findByItemIdArray(['123','456']).then((result) => {
        expect(result).to.have.length(2);
      });
    });
  });
});
