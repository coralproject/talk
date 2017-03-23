const ActionModel = require('../../../models/action');
const ActionsService = require('../../../services/actions');

const expect = require('chai').expect;

describe('services.ActionsService', () => {
  let mockActions = [];

  beforeEach(() => ActionModel.create([
    {
      action_type: 'FLAG',
      item_id: '123',
      item_type: 'COMMENTS',
      user_id: 'flagginguserid'
    },
    {
      action_type: 'FLAG',
      item_id: '456',
      item_type: 'COMMENTS'
    },
    {
      action_type: 'FLAG',
      item_id: '123',
      item_type: 'COMMENTS'
    },
    {
      action_type: 'LIKE',
      item_id: '123',
      item_type: 'COMMENTS'
    }
  ]).then((actions) => {
    mockActions = actions;
  }));

  describe('#findById()', () => {
    it('should find an action by id', () => {
      return ActionsService.findById(mockActions[0].id).then((result) => {
        expect(result).to.not.be.null;
        expect(result).to.have.property('action_type', 'FLAG');
      });
    });
  });

  describe('#findByItemIdArray()', () => {
    it('should find an array of actions from an array of item_ids', () => {
      return ActionsService.findByItemIdArray(['123', '456']).then((result) => {
        expect(result).to.have.length(4);
      });
    });
  });

  describe('#getActionSummaries()', () => {
    it('should return properly formatted summaries from an array of item_ids', () => {
      return ActionsService
        .getActionSummaries(['123', '789'])
        .then((summaries) => {
          expect(summaries).to.have.length(2);

          expect(summaries).to.deep.include({
            action_type: 'LIKE',
            count: 1,
            item_id: '123',
            item_type: 'COMMENTS',
            current_user: null
          });

          expect(summaries).to.deep.include({
            action_type: 'FLAG',
            count: 2,
            item_id: '123',
            item_type: 'COMMENTS',
            current_user: null
          });
        });
    });

    it('should include a current user when one is passed', () => {
      return ActionsService
        .getActionSummaries(['123'], 'flagginguserid')
        .then((summaries) => {
          expect(summaries).to.have.length(2);

          let summary = summaries.find((s) => s.item_id === '123' && s.action_type === 'FLAG');

          expect(summary).to.not.be.undefined;
          expect(summary.current_user).to.not.be.null;
          expect(summary.current_user).to.have.property('item_id', '123');
          expect(summary.current_user).to.have.property('item_type', 'COMMENTS');
          expect(summary.current_user).to.have.property('user_id', 'flagginguserid');
          expect(summary.current_user).to.have.property('action_type', 'FLAG');
        });
    });

    it('should not include a current user when one is passed for a user that doesn\'t have an action', () => {
      return ActionsService
        .getActionSummaries(['123'], 'flagginguserid2')
        .then((summaries) => {
          expect(summaries).to.have.length(2);

          summaries.forEach((summary) => {
            expect(summary).to.not.be.undefined;
            expect(summary).to.have.property('current_user', null);
          });
        });
    });
  });
});
