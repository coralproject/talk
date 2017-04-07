const expect = require('chai').expect;
const {graphql} = require('graphql');

const schema = require('../../../graph/schema');
const Context = require('../../../graph/context');
const UsersService = require('../../../services/users');
const SettingsService = require('../../../services/settings');

describe('graph.mutations.ignoreUser', () => {
  beforeEach(async () => {
    await SettingsService.init();
  });

  const ignoreUserMutation = `
    mutation ignoreUser ($id: ID!) {
      ignoreUser(id:$id) {
        errors {
          translation_key
        }
      }
    }
  `;

  const getMyIgnoredUsersQuery = `
    query myIgnoredUsers {
      myIgnoredUsers {
        id,
        username
      }
    }
  `;

  // @TODO (bengo) - test a user can't ignore themselves
  it('users can ignoreUser', async () => {
    const user = await UsersService.createLocalUser('usernameA@example.com', 'password', 'usernameA');
    const userToIgnore = await UsersService.createLocalUser('usernameB@example.com', 'password', 'usernameB');
    const context = new Context({user});
    const ignoreUserResponse = await graphql(schema, ignoreUserMutation, {}, context, {id: userToIgnore.id});
    if (ignoreUserResponse.errors && ignoreUserResponse.errors.length) {
      console.error(ignoreUserResponse.errors);
    }
    expect(ignoreUserResponse.errors).to.be.empty;

    // now check my ignored users
    const myIgnoredUsersResponse = await graphql(schema, getMyIgnoredUsersQuery, {}, context, {});
    if (myIgnoredUsersResponse.errors && myIgnoredUsersResponse.errors.length) {
      console.error(myIgnoredUsersResponse.errors);
    }
    expect(myIgnoredUsersResponse.errors).to.be.empty;
    const myIgnoredUsers = myIgnoredUsersResponse.data.myIgnoredUsers;
    expect(myIgnoredUsers.length).to.equal(1);
    expect(myIgnoredUsers[0].id).to.equal(userToIgnore.id);
    expect(myIgnoredUsers[0].username).to.equal(userToIgnore.username);
  });

});
