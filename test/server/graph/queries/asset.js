const expect = require('chai').expect;
const {graphql} = require('graphql');

const schema = require('../../../../graph/schema');
const Context = require('../../../../graph/context');
const UsersService = require('../../../../services/users');
const SettingsService = require('../../../../services/settings');
const Asset = require('../../../../models/asset');
const CommentsService = require('../../../../services/comments');

describe('graph.queries.asset', () => {
  let asset, users;
  beforeEach(async () => {
    await SettingsService.init();
    asset = await Asset.create({id: '1', url: 'https://example.com'});
    users = await UsersService.createLocalUsers([
      {
        email: 'usernameA@example.com',
        password: 'password',
        username: 'usernameA'
      },
      {
        email: 'usernameB@example.com',
        password: 'password',
        username: 'usernameB'
      },
      {
        email: 'usernameC@example.com',
        password: 'password',
        username: 'usernameC'
      }
    ]);
  });

  it('can get comments edge', async () => {
    const context = new Context({user: users[0]});

    await CommentsService.publicCreate([1, 2].map(() => ({
      author_id: users[0].id,
      asset_id: asset.id,
      body: `hello there! ${String(Math.random()).slice(2)}`,
    })));

    const assetCommentsQuery = `
      query assetCommentsQuery($id: ID!) {
        asset(id: $id) {
          comments(limit: 10) {
            edges {
              id
              body
            }
          }
        }
      }
    `;
    const res = await graphql(schema, assetCommentsQuery, {}, context, {id: asset.id});
    expect(res.erros).is.empty;
    const comments = res.data.asset.comments.edges;
    expect(comments.length).to.equal(2);
  });

  it('can query comments edge to exclude comments ignored by user', async () => {
    const context = new Context({user: users[0]});

    await Promise.all(users.slice(1, 3).map((user) => CommentsService.publicCreate({
      author_id: user.id,
      asset_id: asset.id,
      body: `hello there! ${String(Math.random()).slice(2)}`,
    })));
    
    // Add the second user to the list of ignored users.
    context.user.ignoresUsers.push(users[1].id);

    const query = `
      query assetCommentsQuery($id: ID!, $url: String!, $excludeIgnored: Boolean!) {
        asset(id: $id, url: $url) {
          comments(limit: 10, excludeIgnored: $excludeIgnored) {
            edges {
              id
              body
            }
          }
        }
      }
    `;

    {
      const res = await graphql(schema, query, {}, context, {
        id: asset.id,
        url: asset.url,
        excludeIgnored: true
      });
      if (res.errors && res.errors.length) {
        console.error(res.errors);
      }
      expect(res.errors).is.empty;
      const comments = res.data.asset.comments.edges;
      expect(comments.length).to.equal(1);
    }
  });

});
