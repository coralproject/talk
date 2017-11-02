const {graphql} = require('graphql');

const schema = require('../../../../graph/schema');
const Context = require('../../../../graph/context');
const SettingsService = require('../../../../services/settings');
const UserModel = require('../../../../models/user');
const UsersService = require('../../../../services/users');

const {expect} = require('chai');

describe('graph.mutations.setUserBanStatus', () => {
  let user;
  beforeEach(async () => {
    await SettingsService.init();

    user = await UsersService.createLocalUser('usernameA@example.com', 'password', 'usernameA');
  });

  const setUserBanStatusMutation = `
    mutation SetUserBanStatus($user_id: ID!, $status: Boolean!) {
      setUserBanStatus(input: {
        id: $user_id,
        status: $status
      }) {
        errors {
          translation_key
        }
      }
    }
  `;

  [
    {self: true, error: 'NOT_AUTHORIZED', roles: null},
    {self: true, error: 'NOT_AUTHORIZED', roles: ['STAFF']},
    {self: true, error: 'NOT_AUTHORIZED', roles: []},
    {error: 'NOT_AUTHORIZED', roles: null},
    {error: 'NOT_AUTHORIZED', roles: ['STAFF']},
    {error: 'NOT_AUTHORIZED', roles: []},
    {error: false, roles: ['MODERATOR']},
    {error: false, roles: ['ADMIN']},
    {error: false, roles: ['ADMIN', 'MODERATOR']},
  ].forEach(({self, error, roles}) => {
    it(`${error ? 'can not' : 'can'} ban ${self ? 'themself' : 'another user'} as a user with roles ${roles && roles.length ? roles : JSON.stringify(roles)}`, async () => {
      const actor = new UserModel({roles});

      // If we're testing self assign, set the id of the actor to the user
      // we're acting on.
      if (self) {
        actor.id = user.id;
      }

      const ctx = new Context({user: actor});

      const {data, errors} = await graphql(schema, setUserBanStatusMutation, {}, ctx, {
        user_id: user.id,
        status: true
      });

      if (errors && errors.length > 0) {
        console.error(errors);
      }
      expect(errors).to.be.undefined;
      if (error) {
        expect(data.setUserBanStatus).to.have.property('errors').not.null;
        expect(data.setUserBanStatus.errors[0]).to.have.property('translation_key', error);
      } else {
        expect(data.setUserBanStatus).to.be.null;

        user = await UserModel.findOne({id: user.id});

        expect(user.status.banned.status).to.be.true;
        expect(user.status.banned.history).to.have.length(1);
        expect(user.status.banned.history[0]).to.have.property('status', true);
        expect(user.status.banned.history[0]).to.have.property('assigned_by', actor.id);
        expect(user.status.banned.history[0]).to.have.property('created_at').not.null;

        expect(user.banned).to.be.true;

        const res = await graphql(schema, setUserBanStatusMutation, {}, ctx, {
          user_id: user.id,
          status: false
        });
        if (res.errors && res.errors.length > 0) {
          console.error(res.errors);
        }
        expect(res.errors).to.be.undefined;
        expect(res.data.setUserBanStatus).to.be.null;

        user = await UserModel.findOne({id: user.id});

        expect(user.status.banned.status).to.be.false;
        expect(user.status.banned.history).to.have.length(2);
        expect(user.status.banned.history[0]).to.have.property('status').to.be.true;
        expect(user.status.banned.history[0]).to.have.property('assigned_by', actor.id);
        expect(user.status.banned.history[0]).to.have.property('created_at').not.null;
        expect(user.status.banned.history[1]).to.have.property('status').to.be.false;
        expect(user.status.banned.history[1]).to.have.property('assigned_by', actor.id);
        expect(user.status.banned.history[1]).to.have.property('created_at').not.null;

        expect(user.banned).to.be.false;
      }
    });
  });
});
