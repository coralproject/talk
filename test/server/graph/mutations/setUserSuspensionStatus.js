const {graphql} = require('graphql');
const timekeeper = require('timekeeper');

const schema = require('../../../../graph/schema');
const Context = require('../../../../graph/context');
const SettingsService = require('../../../../services/settings');
const UserModel = require('../../../../models/user');
const UsersService = require('../../../../services/users');

const chai = require('chai');
chai.use(require('chai-datetime'));
const {expect} = chai;

describe('graph.mutations.setUserSuspensionStatus', () => {
  let user;
  beforeEach(async () => {
    await SettingsService.init();

    user = await UsersService.createLocalUser('usernameA@example.com', 'password', 'usernameA');
  });

  const setUserSuspensionStatusMutation = `
    mutation SetUserUsernameStatus($user_id: ID!, $until: Date) {
      setUserSuspensionStatus(input: {
        id: $user_id,
        until: $until
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
    it(`${error ? 'can not' : 'can'} suspend ${self ? 'themself' : 'another user'} as a user with roles ${roles && roles.length ? roles : JSON.stringify(roles)}`, async () => {
      const actor = new UserModel({roles});

      // If we're testing self assign, set the id of the actor to the user
      // we're acting on.
      if (self) {
        actor.id = user.id;
      }

      const ctx = new Context({user: actor});

      const now = new Date();
      const oneHourFromNow = new Date(new Date(now).setHours(now.getHours() + 1));

      const {data, errors} = await graphql(schema, setUserSuspensionStatusMutation, {}, ctx, {
        user_id: user.id,
        until: oneHourFromNow
      });

      if (errors && errors.length > 0) {
        console.error(errors);
      }
      expect(errors).to.be.undefined;
      if (error) {
        expect(data.setUserSuspensionStatus).to.have.property('errors').not.null;
        expect(data.setUserSuspensionStatus.errors[0]).to.have.property('translation_key', error);
      } else {
        expect(data.setUserSuspensionStatus).to.be.null;

        user = await UserModel.findOne({id: user.id});

        // Mongoose messes with the date, check within a 2 second window.
        expect(user.status.suspension.until).to.be.withinTime(new Date(oneHourFromNow.getTime() - 1000), new Date(oneHourFromNow.getTime() + 1000));
        expect(user.status.suspension.history).to.have.length(1);
        expect(user.status.suspension.history[0]).to.have.property('until').to.be.withinTime(new Date(oneHourFromNow.getTime() - 1000), new Date(oneHourFromNow.getTime() + 1000));
        expect(user.status.suspension.history[0]).to.have.property('assigned_by', actor.id);
        expect(user.status.suspension.history[0]).to.have.property('created_at').not.null;

        expect(user.suspended).to.be.true;
        timekeeper.travel(new Date(oneHourFromNow.getTime() + 10000));
        expect(user.suspended).to.be.false;
        timekeeper.reset();

        const res = await graphql(schema, setUserSuspensionStatusMutation, {}, ctx, {
          user_id: user.id,
          until: null
        });
        if (res.errors && res.errors.length > 0) {
          console.error(res.errors);
        }
        expect(res.errors).to.be.undefined;
        expect(res.data.setUserSuspensionStatus).to.be.null;

        user = await UserModel.findOne({id: user.id});

        // Mongoose messes with the date, check within a 2 second window.
        expect(user.status.suspension.until).to.be.null;
        expect(user.status.suspension.history).to.have.length(2);
        expect(user.status.suspension.history[0]).to.have.property('until').to.be.withinTime(new Date(oneHourFromNow.getTime() - 1000), new Date(oneHourFromNow.getTime() + 1000));
        expect(user.status.suspension.history[0]).to.have.property('assigned_by', actor.id);
        expect(user.status.suspension.history[0]).to.have.property('created_at').not.null;
        expect(user.status.suspension.history[1]).to.have.property('until').to.be.null;
        expect(user.status.suspension.history[1]).to.have.property('assigned_by', actor.id);
        expect(user.status.suspension.history[1]).to.have.property('created_at').not.null;

        expect(user.suspended).to.be.false;
      }
    });
  });
});
