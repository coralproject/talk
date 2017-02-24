const {expect} = require('chai');
const {graphql} = require('graphql');

const schema = require('../../../graph/schema');
const Context = require('../../../graph/context');
const UserModel = require('../../../models/user');
const AssetModel = require('../../../models/asset');
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
        {id: '1', body: 'a new comment!'},
        {id: '2', body: 'a new comment!'},
        {id: '3', body: 'a new comment!'}
      ]));

      [
        {liked: 0, flagged: 0, actions: []},
        {liked: 1, flagged: 0, actions: [{action_type: 'LIKE', item_id: '1', item_type: 'COMMENTS'}]},
        {liked: 0, flagged: 1, actions: [{action_type: 'FLAG', item_id: '1', item_type: 'COMMENTS'}]},
        {liked: 1, flagged: 1, actions: [
          {action_type: 'FLAG', item_id: '1', item_type: 'COMMENTS'},
          {action_type: 'LIKE', item_id: '1', item_type: 'COMMENTS'}
        ]},
        {liked: 3, flagged: 1, actions: [
          {action_type: 'LIKE', item_id: '1', item_type: 'COMMENTS'},
          {action_type: 'LIKE', item_id: '2', item_type: 'COMMENTS'},
          {action_type: 'LIKE', item_id: '3', item_type: 'COMMENTS'},
          {action_type: 'FLAG', item_id: '3', item_type: 'COMMENTS'}
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

  describe('#Assets', () => {
    const query = `
      fragment metrics on Asset {
        id
        action_summaries {
          type: __typename
          actionCount
          actionableItemCount
        }
      }

      query Metrics($from: Date!, $to: Date!) {
        assetsByFlag: assetMetrics(from: $from, to: $to, sort: FLAG) {
          ...metrics
        }
        assetsByLike: assetMetrics(from: $from, to: $to, sort: LIKE) {
          ...metrics
        }
      }
    `;

    describe('different comment states', () => {

      beforeEach(() => Promise.all([
        AssetModel.create([
          {id: 'a1', url: 'http://localhost:3030/article/1'},
          {id: 'a2', url: 'http://localhost:3030/article/2'}
        ]),
        CommentModel.create([
          {id: 'c1', asset_id: 'a1', body: 'a new comment!'},
          {id: 'c2', asset_id: 'a1', body: 'a new comment!'},
          {id: 'c3', asset_id: 'a1', body: 'a new comment!'}
        ])
      ]));

      [
        {liked: 0, flagged: 0, actions: []},
        {liked: 1, flagged: 0, actions: [{action_type: 'LIKE', item_id: 'c1', item_type: 'COMMENTS'}]},
        {liked: 0, flagged: 1, actions: [{action_type: 'FLAG', item_id: 'c1', item_type: 'COMMENTS'}]},
        {liked: 1, flagged: 1, actions: [
          {action_type: 'FLAG', item_id: 'c1', item_type: 'COMMENTS'},
          {action_type: 'LIKE', item_id: 'c1', item_type: 'COMMENTS'}
        ]},
        {liked: 1, flagged: 1, actions: [
          {action_type: 'LIKE', item_id: 'c1', item_type: 'COMMENTS'},
          {action_type: 'LIKE', item_id: 'c2', item_type: 'COMMENTS'},
          {action_type: 'LIKE', item_id: 'c3', item_type: 'COMMENTS'},
          {action_type: 'FLAG', item_id: 'c3', item_type: 'COMMENTS'}
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
                console.log(JSON.stringify(errors, null, 2));

                expect(errors).to.be.undefined;
                expect(data.assetsByLike).to.have.length(liked);
                expect(data.assetsByFlag).to.have.length(flagged);
              });
          });

        });

      });

    });
  });
});
