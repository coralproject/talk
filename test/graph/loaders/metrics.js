const {expect} = require('chai');
const {graphql} = require('graphql');

const schema = require('../../../graph/schema');
const Context = require('../../../graph/context');
const UserModel = require('../../../models/user');
const SettingsService = require('../../../services/settings');
const ActionModel = require('../../../models/action');
const CommentModel = require('../../../models/comment');

describe('graph.loaders.Metrics', () => {
  beforeEach(() => SettingsService.init());

  describe('#Comments', () => {
    const query = `
      query CommentMetrics($from: Date!, $to: Date!) {
        liked: commentMetrics(from: $from, to: $to, sort: LIKE) {
          id
        }
        flagged: commentMetrics(from: $from, to: $to, sort: FLAG) {
          id
        }
      }
    `;

    describe('different comment states', () => {

      beforeEach(() => CommentModel.create([
        {id: '1', body: 'a new comment!'}
      ]));

      [
        {liked: 0, flagged: 0, actions: []},
        {liked: 1, flagged: 0, actions: [{action_type: 'LIKE', item_id: '1', item_type: 'COMMENTS'}]},
        {liked: 0, flagged: 1, actions: [{action_type: 'FLAG', item_id: '1', item_type: 'COMMENTS'}]},
        {liked: 1, flagged: 1, actions: [
          {action_type: 'FLAG', item_id: '1', item_type: 'COMMENTS'},
          {action_type: 'LIKE', item_id: '1', item_type: 'COMMENTS'}
        ]}
      ].forEach(({liked, flagged, actions}) => {

        describe(`with actions=${actions.length}`, () => {

          beforeEach(() => ActionModel.create(actions));

          it(`returns the correct amount of metrics liked=${liked} flagged=${flagged}`, () => {
            const context = new Context({user: new UserModel({roles: ['ADMIN']})});

            return graphql(schema, query, {}, context, {
              from: (new Date()).setMinutes((new Date()).getMinutes() - 5),
              to: (new Date()).setMinutes((new Date()).getMinutes() + 5)
            })
              .then(({data, errors}) => {
                expect(errors).to.be.undefined;
                expect(data.liked).to.have.length(liked);
                expect(data.flagged).to.have.length(flagged);
              });
          });

        });

      });

    });
  });
});
