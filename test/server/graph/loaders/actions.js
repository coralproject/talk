const chai = require('chai');
chai.use(require('chai-as-promised'));
const { expect } = chai;
const sinon = require('sinon');
const { find } = require('lodash');
const loaders = require('../../../../graph/loaders/actions');

describe('graph.loaders.Actions', () => {
  describe('#getAuthoredByID', () => {
    it('loads the correct entries', async () => {
      const spy = sinon.spy(async () => [
        { item_id: 'comment_1' },
        { item_id: 'comment_2' },
      ]);
      const {
        Actions: { getAuthoredByID },
      } = loaders({
        user: { id: 'user_1' },
        connectors: { services: { Actions: { getUserActions: spy } } },
      });

      const actions = await getAuthoredByID.loadMany([
        'comment_2',
        'comment_1',
      ]);

      expect(spy.calledWith('user_1', ['comment_2', 'comment_1']));
      expect(actions).to.have.length(2);
      expect(actions[0]).to.have.length(1);
      expect(actions[0][0]).to.have.property('item_id', 'comment_2');
      expect(actions[1]).to.have.length(1);
      expect(actions[1][0]).to.have.property('item_id', 'comment_1');
    });
  });

  describe('#getSummariesByItem', () => {
    describe('logged out user', () => {
      it('does not include any user data', async () => {
        const {
          Actions: { getSummariesByItem },
        } = loaders({
          loaders: {
            Actions: {
              getAuthoredByID: {
                load: () => Promise.reject(new Error('should not be called')),
              },
            },
          },
          user: null,
        });

        const summaries = await getSummariesByItem.load({
          id: '1',
          action_counts: { flag: 1, flag_comment_offensive: 1, respect: 2 },
        });

        expect(summaries).to.have.length(2);

        const flag = find(summaries, { action_type: 'FLAG' });
        expect(flag).to.be.defined;

        expect(flag).to.have.property('current_user', null);
        expect(flag).to.have.property('action_type', 'FLAG');
        expect(flag).to.have.property('group_id', 'COMMENT_OFFENSIVE');
        expect(flag).to.have.property('count', 1);

        const respect = find(summaries, { action_type: 'RESPECT' });
        expect(respect).to.be.defined;

        expect(respect).to.have.property('current_user', null);
        expect(respect).to.have.property('action_type', 'RESPECT');
        expect(respect).to.have.property('group_id', null);
        expect(respect).to.have.property('count', 2);
      });
    });

    describe('logged in user', () => {
      it('does include user', async () => {
        const {
          Actions: { getSummariesByItem },
        } = loaders({
          loaders: {
            Actions: {
              getAuthoredByID: {
                load: commentID => {
                  expect(commentID).to.equal('comment_1');
                  return [
                    {
                      id: 'action_1',
                      action_type: 'FLAG',
                      group_id: 'COMMENT_OFFENSIVE',
                    },
                  ];
                },
              },
            },
          },
          user: { id: 'user_1' },
        });

        const summaries = await getSummariesByItem.load({
          id: 'comment_1',
          action_counts: { flag: 1, flag_comment_offensive: 1, respect: 2 },
        });

        expect(summaries).to.have.length(2);

        const flag = find(summaries, { action_type: 'FLAG' });
        expect(flag).to.be.defined;

        expect(flag).to.have.property('action_type', 'FLAG');
        expect(flag).to.have.property('group_id', 'COMMENT_OFFENSIVE');
        expect(flag).to.have.property('count', 1);

        expect(flag).to.have.property('current_user').not.null;
        expect(flag.current_user).to.have.property('id', 'action_1');

        const respect = find(summaries, { action_type: 'RESPECT' });
        expect(respect).to.be.defined;

        expect(respect).to.have.property('current_user', null);
        expect(respect).to.have.property('action_type', 'RESPECT');
        expect(respect).to.have.property('group_id', null);
        expect(respect).to.have.property('count', 2);
      });
    });
  });
});
