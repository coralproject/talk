const { graphql } = require('graphql');

const schema = require('../../../../graph/schema');
const Context = require('../../../../graph/context');
const UsersService = require('../../../../services/users');
const SettingsService = require('../../../../services/settings');
const Asset = require('../../../../models/asset');
const CommentsService = require('../../../../services/comments');

const { expect } = require('chai');

describe('graph.queries.asset', () => {
  let assets, users, comments;
  beforeEach(async () => {
    await SettingsService.init();
    assets = await Asset.create([
      { id: '1', url: 'https://example.com/?id=1' },
      { id: '2', url: 'https://example.com/?id=2' },
    ]);
    users = await UsersService.createLocalUsers([
      {
        email: 'usernameA@example.com',
        password: 'password',
        username: 'usernameA',
      },
      {
        email: 'usernameB@example.com',
        password: 'password',
        username: 'usernameB',
      },
      {
        email: 'usernameC@example.com',
        password: 'password',
        username: 'usernameC',
      },
    ]);
    comments = await Promise.all(
      [0, 0, 1, 1].map(idx =>
        CommentsService.publicCreate({
          author_id: users[idx].id,
          asset_id: assets[idx].id,
          body: `hello there! ${String(Math.random()).slice(2)}`,
        })
      )
    );
  });

  it('will not show the same asset stream across multiple assets', async () => {
    const context = new Context({ user: users[0] });

    const query = `
      fragment assetFragment on Asset {
        comments(query: {limit: 2}) {
          nodes {
            id
          }
          hasNextPage
        }
      }

      query assetQuery($id: ID!, $otherID: ID!) {
        asset(id: $id) {
          ...assetFragment
        }
        otherAsset: asset(id: $otherID) {
          ...assetFragment
        }
      }
    `;

    let res = await graphql(schema, query, {}, context, {
      id: assets[0].id,
      otherID: assets[1].id,
    });
    if (res.errors) {
      console.error(res.errors);
    }
    expect(res.errors).is.empty;

    let {
      asset: { comments: asset },
      otherAsset: { comments: otherAsset },
    } = res.data;

    expect(asset.nodes).to.have.length(2);
    expect(asset.hasNextPage).to.be.false;
    expect(asset.nodes.map(({ id }) => id)).to.have.members(
      comments.slice(0, 2).map(({ id }) => id)
    );
    expect(otherAsset.nodes).to.have.length(2);
    expect(otherAsset.hasNextPage).to.be.false;
    expect(otherAsset.nodes.map(({ id }) => id)).to.have.members(
      comments.slice(2, 4).map(({ id }) => id)
    );

    for (let node of asset.nodes) {
      for (let otherNode of otherAsset.nodes) {
        expect(node.id).to.not.equal(otherNode.id);
      }
    }
  });

  it('can get comments edge', async () => {
    const context = new Context({ user: users[0] });

    const assetCommentsQuery = `
      query assetCommentsQuery($id: ID!) {
        asset(id: $id) {
          comments(query: {limit: 10}) {
            nodes {
              id
              body
              created_at
            }
            startCursor
            endCursor
            hasNextPage
          }
        }
      }
    `;
    const res = await graphql(schema, assetCommentsQuery, {}, context, {
      id: assets[0].id,
    });
    const {
      nodes,
      startCursor,
      endCursor,
      hasNextPage,
    } = res.data.asset.comments;
    expect(nodes.length).to.equal(2);
    expect(startCursor).to.equal(nodes[0].created_at);
    expect(endCursor).to.equal(nodes[1].created_at);
    expect(hasNextPage).to.be.false;
  });

  it('can query comments edge to exclude comments ignored by user', async () => {
    const context = new Context({ user: users[0] });

    // Add the second user to the list of ignored users.
    context.user.ignoresUsers.push(users[1].id);

    const query = `
      query assetCommentsQuery($id: ID!, $url: String!, $excludeIgnored: Boolean!) {
        asset(id: $id, url: $url) {
          comments(query: {limit: 10, excludeIgnored: $excludeIgnored}) {
            nodes {
              id
              body
            }
          }
        }
      }
    `;

    {
      const res = await graphql(schema, query, {}, context, {
        id: assets[0].id,
        url: assets[0].url,
        excludeIgnored: true,
      });
      expect(res.errors).is.empty;
      const { nodes } = res.data.asset.comments;
      expect(nodes.length).to.equal(2);
    }
  });
});
