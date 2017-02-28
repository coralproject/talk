const expect = require('chai').expect;
const {graphql} = require('graphql');

const schema = require('../../../graph/schema');
const Context = require('../../../graph/context');
const UserModel = require('../../../models/user');
const SettingsService = require('../../../services/settings');
const CommentsService = require('../../../services/comments');

describe('graph.mutations.removeCommentTag', () => {
  let comment;
  beforeEach(async () => {
    SettingsService.init();
    comment = await CommentsService.publicCreate({body: `hello there! ${  String(Math.random()).slice(2)}`});
  });

  const query = `
    mutation RemoveCommentTag ($id: ID!, $tag: String!) {
      removeCommentTag(id:$id, tag:$tag) {
        comment {
          tags {
            name
          }
        }
        errors {
          translation_key
        }
      }
    }
  `;

  it('can add remove tags from comments', async () => {
    const user = new UserModel({});
    const context = new Context({user});

    // add a tag first
    await CommentsService.addTag(comment.id, 'BEST');
    const response = await graphql(schema, query, {}, context, {id: comment.id, tag: 'BEST'});
    if (response.errors && response.errors.length) {
      console.error(response.errors);
    }
    expect(response.errors).to.be.empty;
    expect(response.data.removeCommentTag.comment.tags).to.deep.equal([]);
  });
});
