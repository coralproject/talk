const {graphql} = require('graphql');

const schema = require('../../../../graph/schema');
const Context = require('../../../../graph/context');
const SettingsService = require('../../../../services/settings');
const UsersService = require('../../../../services/users');

const {expect} = require('chai');

describe('graph.mutations.changeUsername', () => {
  let user;
  beforeEach(async () => {
    await SettingsService.init();
    user = await UsersService.createLocalUser('test@test.com', 'testpassword1!', 'kirk');

    expect(user).to.have.property('username', 'kirk');
    expect(user).to.have.property('lowercaseUsername', 'kirk');
    expect(user.status.username.status).to.equal('SET');
  });

  const changeUsernameMutation = `
    mutation ChangeUsername($user_id: ID!, $username: String!) {
      changeUsername(id: $user_id, username: $username) {
        errors {
          translation_key
        }
      }
    }

    query User {
      me {
        state {
          status {
            username {
              history {
                status
                assigned_by {
                  username
                }
                created_at
              }
            }
          }
        }
      }
    }
  `;

  [
    {roles: null},
    {roles: ['STAFF']},
    {roles: []},
    {roles: ['MODERATOR']},
    {roles: ['ADMIN']},
    {roles: ['ADMIN', 'MODERATOR']},
  ].forEach(({roles}) => {
    it(`can change the username with roles ${roles && roles.length ? roles : JSON.stringify(roles)}`, async () => {
      let username = 'spock';

      let ctx = new Context({user});

      let res = await graphql(schema, changeUsernameMutation, {}, ctx, {
        user_id: user.id,
        username,
      }, 'ChangeUsername');

      if (res.errors && res.errors.length > 0) {
        console.error(res.errors);
      }

      expect(res.errors).to.be.undefined;
      expect(res.data.changeUsername).to.have.property('errors');
      expect(res.data.changeUsername.errors).to.have.length(1);
      expect(res.data.changeUsername.errors[0]).to.have.property('translation_key', 'NOT_AUTHORIZED');

      // Set the user to the desired status.
      user = await UsersService.setUsernameStatus(user.id, 'REJECTED');

      expect(user.status.username.status, 'REJECTED');

      ctx = new Context({user});

      res = await graphql(schema, changeUsernameMutation, {}, ctx, {
        user_id: user.id,
        username,
      }, 'ChangeUsername');

      if (res.errors && res.errors.length > 0) {
        console.error(res.errors);
      }

      expect(res.errors).to.be.undefined;
      expect(res.data.changeUsername).to.be.null;

      res = await graphql(schema, changeUsernameMutation, {}, ctx, {}, 'User');

      if (res.errors && res.errors.length > 0) {
        console.error(res.errors);
      }

      expect(res.errors).to.be.undefined;

      expect(res.data.me.state.status.username.status, 'CHANGED');
    });
  });
});
