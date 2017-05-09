const expect = require('chai').expect;
const {graphql} = require('graphql');

const schema = require('../../../../graph/schema');
const Context = require('../../../../graph/context');
const AssetModel = require('../../../../models/asset');
const UserModel = require('../../../../models/user');
const SettingsService = require('../../../../services/settings');
const CommentsService = require('../../../../services/comments');

describe('graph.mutations.addCommentTag', () => {
  let comment, asset;
  beforeEach(async () => {
    await SettingsService.init();
    
    asset = new AssetModel({url: 'http://new.test.com/'});
    await asset.save();

    comment = await CommentsService.publicCreate({asset_id: asset.id, body: `hello there! ${String(Math.random()).slice(2)}`});
  });

  const query = `
    mutation AddCommentTag ($id: ID!, $asset_id: ID!, $name: String!) {
      addCommentTag(id: $id, asset_id: $asset_id, name: $name) {
        errors {
          translation_key
        }
      }
    }
  `;

  it('moderators can add tags to comments', async () => {
    const user = new UserModel({roles: ['MODERATOR' ]});
    const context = new Context({user});
    const response = await graphql(schema, query, {}, context, {id: comment.id, asset_id: asset.id, name: 'BEST'});
    if (response.errors && response.errors.length) {
      console.error(response.errors);
    }
    expect(response.errors).to.be.empty;

    let {tags} = await CommentsService.findById(comment.id);
    expect(tags).to.have.length(1);
  });

  describe('users who cant add tags', () => {
    Object.entries({
      'anonymous': undefined,
      'regular commenter': new UserModel({}),
      'banned moderator': new UserModel({roles: ['MODERATOR'], status: 'BANNED'})
    }).forEach(([ userDescription, user ]) => {
      it(userDescription, async () => {
        const context = new Context({user});
        const response = await graphql(schema, query, {}, context, {id: comment.id, asset_id: asset.id, name: 'BEST'});
        if (response.errors && response.errors.length) {
          console.error(response.errors);
        }
        expect(response.errors).to.be.empty;
        expect(response.data.addCommentTag.errors).to.deep.equal([{'translation_key':'NOT_AUTHORIZED'}]);
      });
    });
  });

});
