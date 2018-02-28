const { graphql } = require('graphql');

const schema = require('../../../../graph/schema');
const Context = require('../../../../graph/context');
const AssetModel = require('../../../../models/asset');
const CommentModel = require('../../../../models/comment');
const UserModel = require('../../../../models/user');
const SettingsService = require('../../../../services/settings');
const CommentsService = require('../../../../services/comments');

const { expect } = require('chai');

describe('graph.mutations.addTag', () => {
  let comment, asset;
  beforeEach(async () => {
    await SettingsService.init();

    asset = new AssetModel({ url: 'http://new.test.com/' });
    await asset.save();

    comment = await CommentsService.publicCreate({
      asset_id: asset.id,
      body: `hello there! ${String(Math.random()).slice(2)}`,
    });
  });

  const query = `
    mutation AddCommentTag ($id: ID!, $asset_id: ID!, $name: String!) {
      addTag(tag: {name: $name, id: $id, item_type: COMMENTS, asset_id: $asset_id}) {
        errors {
          translation_key
        }
      }
    }
  `;

  it('moderators can add tags to comments', async () => {
    const user = new UserModel({ role: 'MODERATOR' });
    const context = new Context({ user });
    const res = await graphql(
      schema,
      query,
      {},
      context,
      { id: comment.id, asset_id: asset.id, name: 'BEST' },
      'AddCommentTag'
    );
    if (res.errors && res.errors.length) {
      console.error(res.errors);
    }

    expect(res.errors).to.be.empty;

    let { tags } = await CommentModel.findOne({ id: comment.id });
    expect(tags).to.have.length(1);
  });

  describe('users who cant add tags', () => {
    Object.entries({
      anonymous: undefined,
      'regular commenter': new UserModel({}),
      'banned moderator': new UserModel({ role: 'MODERATOR', banned: true }),
    }).forEach(([userDescription, user]) => {
      it(userDescription, async () => {
        const context = new Context({ user });
        const res = await graphql(
          schema,
          query,
          {},
          context,
          { id: comment.id, asset_id: asset.id, name: 'BEST' },
          'AddCommentTag'
        );
        if (res.errors && res.errors.length) {
          console.error(res.errors);
        }
        expect(res.errors).to.be.empty;
        expect(res.data.addTag.errors).to.deep.equal([
          { translation_key: 'NOT_AUTHORIZED' },
        ]);
      });
    });
  });
});
