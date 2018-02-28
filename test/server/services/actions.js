const ActionModel = require('../../../models/action');
const ActionsService = require('../../../services/actions');
const CommentModel = require('../../../models/comment');

const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;

describe('services.ActionsService', () => {
  let mockActions = [];
  let comment;

  beforeEach(async () => {
    comment = await CommentModel.create({
      body: 'comment 10',
      asset_id: '123',
      status_history: [],
      parent_id: '',
      author_id: '123',
      id: '1',
    });

    mockActions = await ActionModel.create([
      {
        action_type: 'FLAG',
        item_id: comment.id,
        item_type: 'COMMENTS',
        user_id: 'flagginguserid',
      },
      {
        action_type: 'FLAG',
        item_id: '456',
        item_type: 'COMMENTS',
        user_id: '1',
      },
      {
        action_type: 'FLAG',
        item_id: comment.id,
        item_type: 'COMMENTS',
        user_id: '2',
      },
      {
        action_type: 'LIKE',
        item_id: comment.id,
        item_type: 'COMMENTS',
        user_id: '3',
      },
    ]);
  });

  describe('#create', () => {
    it('creates an action', async () => {
      const srcAction = {
        action_type: 'LIKE',
        item_type: 'COMMENTS',
        item_id: comment.id,
      };

      const createdAction = await ActionsService.create(srcAction);

      expect(createdAction).is.not.null;
      expect(createdAction).has.property('id');
      expect(createdAction).has.property('item_id', comment.id);

      const retrievedAction = await ActionModel.findOne({
        id: createdAction.id,
      });

      expect(retrievedAction).is.not.null;
      expect(retrievedAction).has.property('id', createdAction.id);
      expect(retrievedAction).has.property('item_id', comment.id);
    });
  });

  describe('#delete', () => {
    it('deletes an action', async () => {
      const deletedAction = await ActionsService.delete(mockActions[0]);

      expect(deletedAction).has.property('id', mockActions[0].id);

      const retrievedAction = await ActionModel.findOne({
        id: deletedAction.id,
      });

      expect(retrievedAction).is.null;
    });
  });

  describe('#findById()', () => {
    it('should find an action by id', () => {
      return ActionsService.findById(mockActions[0].id).then(result => {
        expect(result).to.not.be.null;
        expect(result).to.have.property('action_type', 'FLAG');
      });
    });
  });

  describe('#findByItemIdArray()', () => {
    it('should find an array of actions from an array of item_ids', () => {
      return ActionsService.findByItemIdArray([comment.id, '456']).then(
        result => {
          expect(result).to.have.length(4);
        }
      );
    });
  });
});
