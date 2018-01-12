const ActionModel = require('../../../models/action');
const ActionsService = require('../../../services/actions');
const CommentModel = require('../../../models/comment');

const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;

const events = require('../../../services/events');
const {
  ACTIONS_NEW,
  ACTIONS_DELETE,
} = require('../../../services/events/constants');

const sinon = require('sinon');

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

    it('fires the callback successfully', async () => {
      const srcAction = {
        action_type: 'LIKE',
        item_type: 'COMMENTS',
        item_id: comment.id,
      };

      const spy = sinon.spy();
      events.once(ACTIONS_NEW, spy);

      const createdAction = await ActionsService.create(srcAction);

      expect(createdAction).is.not.null;
      expect(createdAction).has.property('id');
      expect(createdAction).has.property('item_id', comment.id);

      expect(spy).to.have.been.calledWith(createdAction);

      const retrievedComment = await CommentModel.findOne({ id: comment.id });

      expect(retrievedComment).to.have.property('action_counts');
      expect(retrievedComment.action_counts).to.have.property('like', 1);
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

    it('fires the callback successfully', async () => {
      const spy = sinon.spy();
      events.once(ACTIONS_DELETE, spy);

      const deletedAction = await ActionsService.delete(mockActions[0]);

      expect(deletedAction).has.property('id', mockActions[0].id);
      expect(spy).to.have.been.calledWith(deletedAction);

      const retrievedComment = await CommentModel.findOne({ id: comment.id });

      expect(retrievedComment).to.have.property('action_counts');
      expect(retrievedComment.action_counts).to.have.property('flag', -1);
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

  describe('#getActionSummaries()', () => {
    it('should return properly formatted summaries from an array of item_ids', () => {
      return ActionsService.getActionSummaries([comment.id, '789']).then(
        summaries => {
          expect(summaries).to.have.length(2);

          expect(summaries).to.deep.include({
            action_type: 'LIKE',
            count: 1,
            item_id: comment.id,
            item_type: 'COMMENTS',
            current_user: null,
          });

          expect(summaries).to.deep.include({
            action_type: 'FLAG',
            count: 2,
            item_id: comment.id,
            item_type: 'COMMENTS',
            current_user: null,
          });
        }
      );
    });

    it('should include a current user when one is passed', () => {
      return ActionsService.getActionSummaries(
        [comment.id],
        'flagginguserid'
      ).then(summaries => {
        expect(summaries).to.have.length(2);

        let summary = summaries.find(
          s => s.item_id === comment.id && s.action_type === 'FLAG'
        );

        expect(summary).to.not.be.undefined;
        expect(summary.current_user).to.not.be.null;
        expect(summary.current_user).to.have.property('item_id', comment.id);
        expect(summary.current_user).to.have.property('item_type', 'COMMENTS');
        expect(summary.current_user).to.have.property(
          'user_id',
          'flagginguserid'
        );
        expect(summary.current_user).to.have.property('action_type', 'FLAG');
      });
    });

    it("should not include a current user when one is passed for a user that doesn't have an action", () => {
      return ActionsService.getActionSummaries(
        [comment.id],
        'flagginguserid2'
      ).then(summaries => {
        expect(summaries).to.have.length(2);

        summaries.forEach(summary => {
          expect(summary).to.not.be.undefined;
          expect(summary).to.have.property('current_user', null);
        });
      });
    });
  });
});
