const expect = require('chai').expect;
const {graphql} = require('graphql');

const schema = require('../../../graph/schema');
const Context = require('../../../graph/context');
const UsersService = require('../../../services/users');
const SettingsService = require('../../../services/settings');
const Asset = require('../../../models/asset');
const CommentsService = require('../../../services/comments');

describe('graph.queries.asset', () => {
  beforeEach(async () => {
    await SettingsService.init();
  });

  it('can get comments edge', async () => {
    const assetId = 'fakeAssetId';
    const assetUrl = 'https://bengo.is';
    await Asset.create({id: assetId, url: assetUrl});

    const user = await UsersService.createLocalUser('usernameA@example.com', 'password', 'usernameA');
    const context = new Context({user});

    await CommentsService.publicCreate([1, 2].map(() => ({
      author_id: user.id,
      asset_id: assetId,
      body: `hello there! ${  String(Math.random()).slice(2)}`,
    })));

    const assetCommentsQuery = `
      query assetCommentsQuery($assetId: ID!, $assetUrl: String!) {
        asset(id: $assetId, url: $assetUrl) {
          comments(limit: 10) {
            id,
            body,
          }
        }
      }
    `;
    const assetCommentsResponse = await graphql(schema, assetCommentsQuery, {}, context, {assetId, assetUrl});
    const comments = assetCommentsResponse.data.asset.comments;
    expect(comments.length).to.equal(2);
  });

  it('can query comments edge to exclude comments ignored by user', async () => {
    const assetId = 'fakeAssetId1';
    const assetUrl = 'https://bengo.is/1';
    await Asset.create({id: assetId, url: assetUrl});

    const userA = await UsersService.createLocalUser('usernameA@example.com', 'password', 'usernameA');
    const userB = await UsersService.createLocalUser('usernameB@example.com', 'password', 'usernameB');
    const userC = await UsersService.createLocalUser('usernameC@example.com', 'password', 'usernameC');
    const context = new Context({user: userA});

    // create 2 comments each for userB, userC
    await Promise.all([userB, userC].map(user => CommentsService.publicCreate([1, 2].map(() => ({
      author_id: user.id,
      asset_id: assetId,
      body: `hello there! ${  String(Math.random()).slice(2)}`,
    })))));

    // ignore userB
    const ignoreUserMutation = `
      mutation ignoreUser ($id: ID!) {
        ignoreUser(id:$id) {
          errors {
            translation_key
          }
        }
      }
    `;
    const ignoreUserResponse = await graphql(schema, ignoreUserMutation, {}, context, {id: userB.id});
    if (ignoreUserResponse.errors && ignoreUserResponse.errors.length) {
      console.error(ignoreUserResponse.errors);
    }
    expect(ignoreUserResponse.errors).to.be.empty;

    const assetCommentsWithoutIgnoredQuery = `
      query assetCommentsQuery($assetId: ID!, $assetUrl: String!, $excludeIgnored: Boolean!) {
        asset(id: $assetId, url: $assetUrl) {
          comments(limit: 10, excludeIgnored: $excludeIgnored) {
            id,
            body,
          }
        }
      }
    `;
    const assetCommentsResponse = await graphql(schema, assetCommentsWithoutIgnoredQuery, {}, context, {assetId, assetUrl, excludeIgnored: true});
    const comments = assetCommentsResponse.data.asset.comments;
    expect(comments.length).to.equal(2);    
  });

});
