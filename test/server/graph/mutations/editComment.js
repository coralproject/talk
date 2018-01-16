const { graphql } = require('graphql');
const timekeeper = require('timekeeper');

const schema = require('../../../../graph/schema');
const Context = require('../../../../graph/context');
const UsersService = require('../../../../services/users');
const AssetModel = require('../../../../models/asset');
const SettingsService = require('../../../../services/settings');
const CommentsService = require('../../../../services/comments');

const { expect } = require('chai');

describe('graph.mutations.editComment', () => {
  let asset, user;
  beforeEach(async () => {
    timekeeper.reset();
    await SettingsService.init();
    asset = await AssetModel.create({});
    user = await UsersService.createLocalUser(
      'usernameA@example.com',
      'password',
      'usernameA'
    );
  });

  const editCommentMutation = `
    mutation EditComment ($id: ID!, $asset_id: ID!, $edit: EditCommentInput) {
      editComment(id:$id, asset_id:$asset_id, edit:$edit) {
        errors {
          translation_key
        }
      }
    }
  `;

  it('a user can edit their own comment', async () => {
    const context = new Context({ user });
    const testStartedAt = new Date();
    const comment = await CommentsService.publicCreate({
      asset_id: asset.id,
      author_id: user.id,
      body: `hello there! ${String(Math.random()).slice(2)}`,
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
      asset_id: asset.id,
      edit: {
        body: newBody,
      },
    });
    if (response.errors && response.errors.length) {
      console.error(response.errors);
    }
    expect(response.errors).to.be.empty;
    if (
      response.data.editComment.errors &&
      response.data.editComment.errors.length > 0
    ) {
      console.error(response.data.editComment.errors);
    }
    expect(response.data.editComment.errors).to.be.null;

    // assert body has changed
    const commentAfterEdit = await CommentsService.findById(comment.id);
    expect(commentAfterEdit.body).to.equal(newBody);
    expect(commentAfterEdit.body_history).to.be.instanceOf(Array);
    expect(commentAfterEdit.body_history.length).to.equal(2);
    expect(commentAfterEdit.body_history[1].body).to.equal(newBody);
    expect(commentAfterEdit.body_history[1].created_at).to.be.instanceOf(Date);
    expect(commentAfterEdit.body_history[1].created_at).to.be.at.least(
      testStartedAt
    );
    expect(commentAfterEdit.status).to.equal('NONE');
  });

  it("A user can't edit their comment outside of the edit comment time window", async () => {
    const comment = await CommentsService.publicCreate({
      asset_id: asset.id,
      author_id: user.id,
      body: `hello there! ${String(Math.random()).slice(2)}`,
    });

    const now = new Date();
    const oneHourFromNow = new Date(new Date(now).setHours(now.getHours() + 1));
    timekeeper.travel(oneHourFromNow);

    const newBody = 'This body should never be set';
    const context = new Context({ user });
    const response = await graphql(schema, editCommentMutation, {}, context, {
      id: comment.id,
      asset_id: asset.id,
      edit: {
        body: newBody,
      },
    });
    if (response.errors && response.errors.length > 0) {
      console.error(response.errors);
    }
    expect(response.errors).to.be.empty;
    expect(response.data.editComment.errors).to.not.be.empty;
    expect(response.data.editComment.errors[0].translation_key).to.equal(
      'EDIT_WINDOW_ENDED'
    );
    const commentAfterEdit = await CommentsService.findById(comment.id);

    // it *hasn't* changed from the original
    expect(commentAfterEdit.body).to.equal(comment.body);
  });

  it("A user can't edit someone else's comment", async () => {
    const comment = await CommentsService.publicCreate({
      asset_id: asset.id,
      author_id: user.id,
      body: `hello there! ${String(Math.random()).slice(2)}`,
    });

    const userB = await UsersService.createLocalUser(
      'usernameB@example.com',
      'password',
      'usernameB'
    );
    const newBody = 'This body should never be set';
    const context = new Context({ user: userB });
    const response = await graphql(schema, editCommentMutation, {}, context, {
      id: comment.id,
      asset_id: asset.id,
      edit: {
        body: newBody,
      },
    });
    expect(response.errors).to.be.empty;
    expect(response.data.editComment.errors).to.not.be.empty;
    expect(response.data.editComment.errors[0].translation_key).to.equal(
      'NOT_AUTHORIZED'
    );
    const commentAfterEdit = await CommentsService.findById(comment.id);

    // it *hasn't* changed from the original
    expect(commentAfterEdit.body).to.equal(comment.body);
  });

  it("A user Can't edit a comment id that doesn't exist", async () => {
    const fakeCommentId = 'nooooope';
    const newBody = 'This body should never be set';
    const context = new Context({ user });
    const response = await graphql(schema, editCommentMutation, {}, context, {
      id: fakeCommentId,
      asset_id: asset.id,
      edit: {
        body: newBody,
      },
    });
    if (response.errors && response.errors.length > 0) {
      console.error(response.errors);
    }
    expect(response.errors).to.be.empty;
    expect(response.data.editComment.errors[0].translation_key).to.equal(
      'NOT_FOUND'
    );
  });

  const bannedWord = 'BANNED_WORD';
  [
    {
      description: 'premod: editing a REJECTED comment is rejected',
      settings: {
        moderation: 'PRE',
      },
      beforeEdit: {
        body: 'I was offensive and thus REJECTED',
        status: 'REJECTED',
      },
      edit: {
        body: 'I have been edited to be less offensive',
      },
      error: true,
    },
    {
      description:
        'editing an ACCEPTED comment to add a bad word sets status to REJECTED',
      settings: {
        moderation: 'POST',
        wordlist: {
          banned: [bannedWord],
        },
      },
      beforeEdit: {
        body: "I'm a perfectly acceptable comment",
        status: 'ACCEPTED',
      },
      edit: {
        body: `I have been sneakily edited to add a banned word: ${bannedWord}`,
      },
      afterEdit: {
        status: 'REJECTED',
      },
    },
    {
      description:
        'postmod: editing a REJECTED comment with banned word be rejected',
      settings: {
        moderation: 'POST',
        wordlist: {
          banned: [bannedWord],
        },
      },
      beforeEdit: {
        body: `I'm a rejected comment with bad word ${bannedWord}`,
        status: 'REJECTED',
      },
      edit: {
        body: 'I have been edited to remove the bad word',
      },
      error: true,
    },
    {
      description:
        'postmod + premodLinksEnable: editing an ACCEPTED comment to add a link sets status to PREMOD',
      settings: {
        moderation: 'POST',
        premodLinksEnable: true,
      },
      beforeEdit: {
        body: "I'm a perfectly acceptable comment",
        status: 'ACCEPTED',
      },
      edit: {
        body: 'I have been edited to add a link: https://coralproject.net/',
      },
      afterEdit: {
        status: 'SYSTEM_WITHHELD',
      },
    },
  ].forEach(({ description, settings, beforeEdit, edit, afterEdit, error }) => {
    it(description, async () => {
      await SettingsService.update(settings);
      const context = new Context({ user });
      const comment = await CommentsService.publicCreate(
        Object.assign(
          {
            asset_id: asset.id,
            author_id: user.id,
          },
          beforeEdit
        )
      );

      // now edit
      const newBody = edit.body;
      const response = await graphql(schema, editCommentMutation, {}, context, {
        id: comment.id,
        asset_id: asset.id,
        edit: {
          body: newBody,
        },
      });

      if (error) {
        expect(response.data.editComment.errors).to.not.be.empty;
      } else {
        if (
          response.data.editComment.errors &&
          response.data.editComment.errors.length
        ) {
          console.error(response.data.editComment.errors);
        }
        expect(response.data.editComment.errors).to.be.null;
        const commentAfterEdit = await CommentsService.findById(comment.id);
        expect(commentAfterEdit.body).to.equal(newBody);
        expect(commentAfterEdit.status).to.equal(afterEdit.status);
      }
    });
  });
});
