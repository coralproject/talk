const expect = require('chai').expect;
const {graphql} = require('graphql');

const schema = require('../../../../graph/schema');
const Context = require('../../../../graph/context');
const UsersService = require('../../../../services/users');
const AssetModel = require('../../../../models/asset');
const SettingsService = require('../../../../services/settings');
const CommentsService = require('../../../../services/comments');

describe('graph.mutations.editComment', () => {
  let asset;
  let user;
  beforeEach(async () => {
    await SettingsService.init();
    asset = await AssetModel.create({});
    user = await UsersService.createLocalUser(
      'usernameA@example.com', 'password', 'usernameA');
  });
  afterEach(async () => {
    await asset.remove();
    await user.remove();
  });

  const editCommentMutation = `
    mutation EditComment ($id: ID!, $edit: EditCommentInput) {
      editComment(id:$id, edit:$edit) {
        errors {
          translation_key
        }
      }
    }
  `;

  // const queryCommentById = `
  //   query commentQuery($id: ID!) {
  //     comment(id: $id) {
  //       body,
  //       status
  //     }
  //   }
  // `;

  it('a user can edit their own comment', async () => {
    const context = new Context({user});
    const testStartedAt = new Date();
    const comment = await CommentsService.publicCreate({
      asset_id: asset.id,
      author_id: user.id,
      body: `hello there! ${  String(Math.random()).slice(2)}`,
    });

    // body_history should be there
    expect(comment.body_history.length).to.equal(1);
    expect(comment.body_history[0].body).to.equal(comment.body);
    expect(comment.body_history[0].created_at).to.be.instanceOf(Date);
    expect(comment.body_history[0].created_at).to.be.at.least(testStartedAt);

    // now edit
    const newBody = 'I have been edited.';
    const response = await graphql(schema, editCommentMutation, {}, context, {
      id: comment.id,
      edit: {
        body: newBody
      }
    });
    if (response.errors && response.errors.length) {
      console.error(response.errors);
    }
    expect(response.errors).to.be.empty;

    // assert body has changed
    const commentAfterEdit = await CommentsService.findById(comment.id);
    expect(commentAfterEdit.body).to.equal(newBody);
    expect(commentAfterEdit.body_history).to.be.instanceOf(Array);
    expect(commentAfterEdit.body_history.length).to.equal(2);
    expect(commentAfterEdit.body_history[1].body).to.equal(newBody);
    expect(commentAfterEdit.body_history[1].created_at).to.be.instanceOf(Date);
    expect(commentAfterEdit.body_history[1].created_at).to.be.at.least(testStartedAt);
    expect(commentAfterEdit.status).to.equal('NONE');
  });

  /**
  Server: When an Edit is sent to the server
  -- The (old) comment.body and (current) timestamp are pushed onto the comment.body_history array.
  -- The status is set to the same status as if the comment is posted for the first time.*
  -- The body of the comment is updated.
  */
  // user can't edit outside of edit window
  // can't edit comment id that doesn't exist
  // user cant edit comments by others

  // should BANNED users be able to edit their comments?

});
