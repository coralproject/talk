const { graphql } = require('graphql');

const schema = require('../../../../graph/schema');
const Context = require('../../../../graph/context');
const UserModel = require('../../../../models/user');
const SettingModel = require('../../../../models/setting');

const AssetModel = require('../../../../models/asset');
const SettingsService = require('../../../../services/settings');
const CommentsService = require('../../../../services/comments');
const TagsService = require('../../../../services/tags');

const { expect } = require('chai');

describe('graph.mutations.removeTag', () => {
  let asset, comment;
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
    mutation RemoveTag($id: ID!, $asset_id: ID!, $name: String!) {
      removeTag(tag: {name: $name, id: $id, item_type: COMMENTS, asset_id: $asset_id}) {
        errors {
          translation_key
        }
      }
    }
  `;

  it('moderators can add remove tags from comments', async () => {
    const user = new UserModel({ role: 'MODERATOR' });
    const context = new Context({ user });

    // add a tag first
    await TagsService.add(
      comment.id,
      'COMMENTS',
      { tag: { name: 'BEST' } },
      false
    );

    const response = await graphql(schema, query, {}, context, {
      id: comment.id,
      asset_id: asset.id,
      name: 'BEST',
    });
    if (response.errors && response.errors.length) {
      console.error(response.errors);
    }
    expect(response.errors).to.be.empty;
    expect(response.data.removeTag).to.be.null;

    let retrievedComment = await CommentsService.findById(comment.id);

    expect(retrievedComment.tags).to.have.length(0);
  });

  describe('users who cant remove tags', () => {
    before(() =>
      SettingModel.findOneAndUpdate(
        { id: 1 },
        {
          $push: {
            tags: {
              id: 'BEST',
              models: ['COMMENTS'],
            },
          },
        }
      )
    );

    Object.entries({
      anonymous: undefined,
      'regular commenter': new UserModel({}),
      'banned moderator': new UserModel({ role: 'MODERATOR', banned: true }),
    }).forEach(([userDescription, user]) => {
      it(userDescription, async function() {
        const context = new Context({ user });

        // add a tag first
        await TagsService.add(
          comment.id,
          'COMMENTS',
          { tag: { name: 'BEST' } },
          false
        );

        const response = await graphql(schema, query, {}, context, {
          id: comment.id,
          asset_id: asset.id,
          name: 'BEST',
        });
        if (response.errors && response.errors.length) {
          console.error(response.errors);
        }
        expect(response.errors).to.be.empty;

        expect(response.data.removeTag.errors).to.deep.equal([
          { translation_key: 'NOT_AUTHORIZED' },
        ]);
      });
    });
  });
});
