const {graphql} = require('graphql');

const schema = require('../../../../graph/schema');
const Context = require('../../../../graph/context');

const UserModel = require('../../../../models/user');
const AssetModel = require('../../../../models/asset');
const ActionModel = require('../../../../models/action');

const SettingsService = require('../../../../services/settings');
const CommentsService = require('../../../../services/comments');

const {expect} = require('chai');

describe('graph.mutations.createComment', () => {
  beforeEach(() => SettingsService.init());

  const query = `
    mutation CreateComment($input: CreateCommentInput = {asset_id: 123, body: "Here's my comment!"}) {
      createComment(input: $input) {
        comment {
          id
          status
          tags {
            tag {
              name
            }
          }
        }
        errors {
          translation_key
        }
      }
    }
  `;

  describe('context with different user properties', () => {

    beforeEach(() => AssetModel.create({id: '123'}));

    [
      {user: null, error: 'NOT_AUTHORIZED'},
      {user: new UserModel({}), error: null}
    ].forEach(({user, error}) => {
      describe(user != null ? 'with user' : 'without user', () => {

        it(error ? 'does not create the comment' : 'creates the comment', () => {
          const context = new Context({user});

          return graphql(schema, query, {}, context)
            .then(({data, errors}) => {
              expect(errors).to.be.undefined;
              if (error) {
                expect(data.createComment).to.have.property('comment').null;
                expect(data.createComment).to.have.property('errors').not.null;
                expect(data.createComment.errors[0]).to.have.property('translation_key', error);
              } else {
                expect(data.createComment).to.have.property('comment').not.null;
                expect(data.createComment).to.have.property('errors').null;
              }
            });
        });

      });
    });

  });

  describe('users with different statuses', () => {

    beforeEach(() => AssetModel.create({id: '123'}));

    [
      {user: new UserModel({status: 'ACTIVE'}), error: null},
      {user: new UserModel({status: 'BANNED'}), error: 'NOT_AUTHORIZED'},
      {user: new UserModel({status: 'PENDING'}), error: null},
      {user: new UserModel({status: 'APPROVED'}), error: null}
    ].forEach(({user, error}) => {
      describe(`user.status=${user.status}`, () => {
        it(error ? 'does not create the comment' : 'creates the comment', () => {
          const context = new Context({user});

          return graphql(schema, query, {}, context)
            .then(({data, errors}) => {
              expect(errors).to.be.undefined;
              if (error) {
                expect(data.createComment).to.have.property('comment').null;
                expect(data.createComment).to.have.property('errors').not.null;
                expect(data.createComment.errors[0]).to.have.property('translation_key', error);
              } else {
                expect(data.createComment).to.have.property('comment').not.null;
                expect(data.createComment).to.have.property('errors').null;
              }
            });
        });
      });
    });

  });

  describe('assets with different statuses', () => {

    [
      {asset: new AssetModel({id: '123', closedAt: new Date((new Date()).getTime() + (10 * 86400000))}), error: null},
      {asset: new AssetModel({id: '123', closedAt: new Date((new Date()).getTime() - (10 * 86400000))}), error: 'COMMENTING_CLOSED'}
    ].forEach(({asset, error}) => {
      describe(`asset.isClosed=${asset.isClosed}`, () => {

        beforeEach(() => asset.save());

        it(error ? 'does not create the comment' : 'creates the comment', () => {
          const context = new Context({user: new UserModel({status: 'ACTIVE'})});

          return graphql(schema, query, {}, context)
            .then(({data, errors}) => {
              expect(errors).to.be.undefined;
              if (error) {
                expect(data.createComment).to.have.property('comment').null;
                expect(data.createComment).to.have.property('errors').not.null;
                expect(data.createComment.errors[0]).to.have.property('translation_key', error);
              } else {
                expect(data.createComment).to.have.property('comment').not.null;
                expect(data.createComment).to.have.property('errors').null;
              }
            });
        });

      });

    });

  });

  describe('comments made with different asset moderation settings', () => {

    [
      {moderation: 'PRE', status: 'PREMOD'},
      {moderation: 'POST', status: 'NONE'}
    ].forEach(({moderation, status}) => {
      describe(`moderation=${moderation}`, () => {

        beforeEach(() => AssetModel.create({id: '123', settings: {moderation}}));

        it(`creates comment with status=${status}`, () => {
          const context = new Context({user: new UserModel({status: 'ACTIVE'})});

          return graphql(schema, query, {}, context)
            .then(({data, errors}) => {
              expect(errors).to.be.undefined;
              expect(data.createComment).to.have.property('comment').not.null;
              expect(data.createComment).to.have.property('errors').null;
              expect(data.createComment.comment).to.have.property('status', status);
            });
        });

      });
    });

  });

  describe('comments with/without banned words', () => {

    beforeEach(() => Promise.all([
      AssetModel.create({id: '123'}),
      SettingsService.update({wordlist: {banned: ['WORST'], suspect: ['EH']}})
    ]));

    [
      {message: 'comment does not contain banned/suspect words', body: 'This is such a nice comment!', status: 'NONE', flagged: false},
      {message: 'comment contains banned words', body: 'This is the WORST comment!', status: 'REJECTED', flagged: true},
      {message: 'comment contains suspect words', body: 'This is the EH comment!', status: 'NONE', flagged: true}
    ].forEach(({message, body, status, flagged}) => {
      describe(message, () => {

        it(`should create a comment with status=${status} and it ${flagged ? 'should' : 'should not'} be flagged`, () => {
          const context = new Context({user: new UserModel({status: 'ACTIVE'})});

          return graphql(schema, query, {}, context, {
            input: {
              asset_id: '123',
              body
            }
          })
            .then(({data, errors}) => {
              expect(errors).to.be.undefined;
              expect(data.createComment).to.have.property('comment').not.null;
              expect(data.createComment.comment).to.have.property('status', status);
              expect(data.createComment).to.have.property('errors').null;

              return ActionModel.find({
                item_id: data.createComment.comment.id,
                action_type: 'FLAG'
              });
            })
            .then((actions) => {
              if (flagged) {
                expect(actions).to.have.length(1);
              } else {
                expect(actions).to.have.length(0);
              }
            });
        });

      });
    });
  });

  describe('users with different roles', () => {

    beforeEach(() => AssetModel.create({id: '123'}));

    [
      {roles: [], tag: null},
      {roles: ['ADMIN'], tag: 'STAFF'},
      {roles: ['MODERATOR'], tag: 'STAFF'},
      {roles: ['ADMIN', 'MODERATOR'], tag: 'STAFF'}
    ].forEach(({roles, tag}) => {
      describe(`user.roles=${JSON.stringify(roles)}`, () => {

        it(`creates comment ${tag ? `with tag=${tag}` : 'without tags'}`, () => {
          const context = new Context({user: new UserModel({roles})});

          return graphql(schema, query, {}, context)
            .then(({data, errors}) => {
              if (errors) {
                console.error(errors);
              }
              expect(errors).to.be.undefined;
              expect(data.createComment).to.have.property('comment').not.null;
              expect(data.createComment).to.have.property('errors').null;

              return CommentsService.findById(data.createComment.comment.id);
            })
            .then(({tags}) => {
              if (tag) {
                expect(tags).to.have.length(1);
                expect(tags[0].tag.name).to.have.equal(tag);
              } else {
                expect(tags).length(0);
              }
            });
        });

      });
    });

  });
});
