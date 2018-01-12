const { graphql } = require('graphql');

const schema = require('../../../../graph/schema');
const Context = require('../../../../graph/context');
const SettingsService = require('../../../../services/settings');
const UserModel = require('../../../../models/user');
const UsersService = require('../../../../services/users');

const chai = require('chai');
chai.use(require('chai-datetime'));
const { expect } = chai;

[
  { status: 'APPROVED', name: 'approve', mutation: 'approveUsername' },
  { status: 'REJECTED', name: 'reject', mutation: 'rejectUsername' },
].forEach(({ status, name, mutation }) => {
  describe(`graph.mutations.${mutation}`, () => {
    let user;
    beforeEach(async () => {
      await SettingsService.init();

      user = await UsersService.createLocalUser(
        'usernameA@example.com',
        'password',
        'usernameA'
      );
    });

    const setUserUsernameStatusMutation = `
    mutation SetUserUsernameStatus($user_id: ID!) {
      ${mutation}(id: $user_id) {
        errors {
          translation_key
        }
      }
    }
  `;

    [
      { self: true, error: 'NOT_AUTHORIZED', role: 'COMMENTER' },
      { self: true, error: 'NOT_AUTHORIZED', role: 'STAFF' },
      { self: true, error: 'NOT_AUTHORIZED', role: 'COMMENTER' },
      { error: 'NOT_AUTHORIZED', role: 'COMMENTER' },
      { error: 'NOT_AUTHORIZED', role: 'STAFF' },
      { error: 'NOT_AUTHORIZED', role: 'COMMENTER' },
      { error: false, role: 'MODERATOR' },
      { error: false, role: 'ADMIN' },
    ].forEach(({ self, error, role }) => {
      it(`${
        error ? 'can not' : 'can'
      } ${name} a username with the user role ${role}${
        self ? ' on themself' : ''
      }`, async () => {
        const actor = new UserModel({ role });

        // If we're testing self assign, set the id of the actor to the user
        // we're acting on.
        if (self) {
          actor.id = user.id;
        }

        const ctx = new Context({ user: actor });

        const { data, errors } = await graphql(
          schema,
          setUserUsernameStatusMutation,
          {},
          ctx,
          {
            user_id: user.id,
          }
        );

        if (errors && errors.length > 0) {
          console.error(errors);
        }
        expect(errors).to.be.undefined;
        if (error) {
          expect(data[mutation]).to.have.property('errors').not.null;
          expect(data[mutation].errors[0]).to.have.property(
            'translation_key',
            error
          );
        } else {
          expect(data[mutation]).to.be.null;

          user = await UserModel.findOne({ id: user.id });

          expect(user.status.username.status).to.equal(status);
          expect(user.status.username.history).to.have.length(2);
          expect(user.status.username.history[0]).to.have.property(
            'status',
            'SET'
          );
          expect(user.status.username.history[0]).to.have.property(
            'assigned_by'
          ).is.null;
          expect(user.status.username.history[0]).to.have.property('created_at')
            .not.null;
          expect(user.status.username.history[1]).to.have.property(
            'status',
            status
          );
          expect(user.status.username.history[1]).to.have.property(
            'assigned_by',
            actor.id
          );
          expect(user.status.username.history[1]).to.have.property('created_at')
            .not.null;

          expect(user.status.username.history[1].created_at).afterTime(
            user.status.username.history[0].created_at
          );
        }
      });
    });
  });
});
