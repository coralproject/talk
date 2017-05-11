const expect = require('chai').expect;
const {graphql} = require('graphql');

const schema = require('../../../../graph/schema');
const Context = require('../../../../graph/context');
const UsersService = require('../../../../services/users');
const SettingsService = require('../../../../services/settings');

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

describe('graph.mutations.ignoreUser', () => {
  beforeEach(async () => {
    await SettingsService.init();
  });

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

  it('users cannot ignore themselves', async () => {
    const user = await UsersService.createLocalUser('usernameA@example.com', 'password', 'usernameA');
    const context = new Context({user});
    const ignoreUserResponse = await graphql(schema, ignoreUserMutation, {}, context, {id: user.id});
    expect(ignoreUserResponse.errors).to.not.be.empty;

    // now check my ignored users
    const myIgnoredUsersResponse = await graphql(schema, getMyIgnoredUsersQuery, {}, context, {});
    if (myIgnoredUsersResponse.errors && myIgnoredUsersResponse.errors.length) {
      console.error(myIgnoredUsersResponse.errors);
    }
    expect(myIgnoredUsersResponse.errors).to.be.empty;
    const myIgnoredUsers = myIgnoredUsersResponse.data.myIgnoredUsers;
    expect(myIgnoredUsers.length).to.equal(0);
  });

});

describe('graph.mutations.stopIgnoringUser', () => {
  beforeEach(async () => {
    await SettingsService.init();
  });

  it('users can stop ignoring another user they ignore', async () => {

    // We're going to ignore 2 users,
    // then stopIgnoring 1 of them
    // then assert myIgnoredUsers only lists the one remaining
    const user = await UsersService.createLocalUser('usernameA@example.com', 'password', 'usernameA');
    const usersToIgnore = await Promise.all([
      UsersService.createLocalUser('usernameB@example.com', 'password', 'usernameB'),
      UsersService.createLocalUser('usernameC@example.com', 'password', 'usernameC'),
    ]);
    const context = new Context({user});

    // ignore two users
    const ignoreUserResponses = await Promise.all(usersToIgnore.map((u) => graphql(schema, ignoreUserMutation, {}, context, {id: u.id})));
    ignoreUserResponses.forEach((response) => {
      if (response.errors && response.errors.length) {
        console.error(response.errors);
      }
      expect(response.errors).to.be.empty;
    });

    const stopIgnoringUserMutation = `
      mutation stopIgnoringUser ($id: ID!) {
        stopIgnoringUser(id:$id) {
          errors {
            translation_key
          }
        }
      }
    `;

    // stop ignoring one user
    const stopIgnoringUserResponse = await graphql(schema, stopIgnoringUserMutation, {}, context, {id: usersToIgnore[0].id});
    if (stopIgnoringUserResponse.errors && stopIgnoringUserResponse.errors.length) {
      console.error(stopIgnoringUserResponse.errors);
    }
    expect(stopIgnoringUserResponse.errors).to.be.empty;

    // now check my ignored users
    const myIgnoredUsersResponse = await graphql(schema, getMyIgnoredUsersQuery, {}, context, {});
    if (myIgnoredUsersResponse.errors && myIgnoredUsersResponse.errors.length) {
      console.error(myIgnoredUsersResponse.errors);
    }
    expect(myIgnoredUsersResponse.errors).to.be.empty;
    const myIgnoredUsers = myIgnoredUsersResponse.data.myIgnoredUsers;
    expect(myIgnoredUsers.length).to.equal(1);
    expect(myIgnoredUsers[0].id).to.equal(usersToIgnore[1].id);
    expect(myIgnoredUsers[0].username).to.equal(usersToIgnore[1].username);
  });

});
