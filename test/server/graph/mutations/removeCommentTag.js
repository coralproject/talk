const expect = require('chai').expect;
const {graphql} = require('graphql');

const schema = require('../../../../graph/schema');
const Context = require('../../../../graph/context');
const UserModel = require('../../../../models/user');
const SettingModel = require('../../../../models/setting');

const SettingsService = require('../../../../services/settings');
const CommentsService = require('../../../../services/comments');

describe('graph.mutations.removeCommentTag', () => {
  let comment;
  beforeEach(async () => {
    await SettingsService.init();
    comment = await CommentsService.publicCreate({body: `hello there! ${  String(Math.random()).slice(2)}`});
  });

  const query = `
    mutation RemoveCommentTag ($id: ID!, $tag: String!) {
      removeCommentTag(id:$id, tag:$tag) {
        comment {
          id
        }
        errors {
          translation_key
        }
      }
    }
  `;

  it('moderators can add remove tags from comments', async () => {
    const user = new UserModel({roles: ['MODERATOR' ]});
    const context = new Context({user});

    // add a tag first
    await CommentsService.addTag(comment.id, 'BEST', user.id);
    const response = await graphql(schema, query, {}, context, {id: comment.id, tag: 'BEST'});
    if (response.errors && response.errors.length) {
      console.error(response.errors);
    }
    expect(response.errors).to.be.empty;
    expect(response.data.removeCommentTag.errors).to.be.null;

    CommentsService.findById(response.data.removeCommentTag.comment.id)
    .then(({tags}) => {
      expect(tags).to.deep.equal([]);
    });

  });

  describe('users who cant remove tags', () => {

    // allow the tag in the settings
    SettingModel.findOneAndUpdate({id: 1}, {
      $push: {
        tags: {
          id: 'BEST',
          models: ['COMMENTS']
        }
      }
    })
    .then(() => {
      Object.entries({
        'anonymous': undefined,
        'regular commenter': new UserModel({}),
        'banned moderator': new UserModel({roles: ['MODERATOR'], status: 'BANNED'})
      }).forEach(([ userDescription, user ]) => {
        it(userDescription, async function () {
          const context = new Context({user});

          // add a tag first
          await CommentsService.addTag(comment.id, 'BEST', user.id);

          const response = await graphql(schema, query, {}, context, {id: comment.id, tag: 'BEST'});
          if (response.errors && response.errors.length) {
            console.error(response.errors);
          }
          expect(response.errors).to.be.empty;

          expect(response.data.removeCommentTag.errors).to.deep.equal([{'translation_key':'NOT_AUTHORIZED'}]);
          expect(response.data.removeCommentTag.comment).to.be.null;
        });
      });
    });
  });

});
