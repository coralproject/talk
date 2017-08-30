const UsersService = require('../../../services/users');
const SettingsService = require('../../../services/settings');

const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;

describe('services.UsersService', () => {

  let mockUsers;
  beforeEach(async () => {
    const settings = {id: '1', moderation: 'PRE', wordlist: {banned: ['bad words'], suspect: ['suspect words']}};

    await SettingsService.init(settings);
    mockUsers = await UsersService.createLocalUsers([{
      email: 'stampi@gmail.com',
      username: 'Stampi',
      password: '1Coral!-'
    }, {
      email: 'sockmonster@gmail.com',
      username: 'Sockmonster',
      password: '2Coral!2'
    }, {
      email: 'marvel@gmail.com',
      username: 'Marvel',
      password: '3Coral!3'
    }]);
  });

  describe('#findById()', () => {
    it('should find a user by id', async () => {
      const user = await UsersService.findById(mockUsers[0].id);
      expect(user).to.have.property('username', 'Stampi');
    });
  });

  describe('#findByIdArray()', () => {
    it('should find an array of users from an array of ids', async () => {
      const ids = mockUsers.map((user) => user.id);
      const users = await UsersService.findByIdArray(ids);
      expect(users).to.have.length(3);
    });
  });

  describe('#findPublicByIdArray()', () => {
    it('should find an array of users from an array of ids', async () => {
      const ids = mockUsers.map((user) => user.id);
      const users = await UsersService.findPublicByIdArray(ids);
      expect(users).to.have.length(3);

      const sorted = users.sort((a, b) =>     {
        if(a.username < b.username) {return -1;}
        if(a.username > b.username) {return 1;}
        return 0;
      });
      expect(sorted[0]).to.have.property('username', 'Marvel');
    });
  });

  describe('#findLocalUser', () => {

    it('should find a user', () => {
      return UsersService
        .findLocalUser(mockUsers[0].profiles[0].id)
        .then((user) => {
          expect(user).to.have.property('username', mockUsers[0].username);
        });
    });

  });

  describe('#createLocalUser', () => {
    it('should not create a user with duplicate username', () => {
      return UsersService.createLocalUsers([{
        email: 'otrostampi@gmail.com',
        username: 'StampiTheSecond',
        password: '1Coralito!'
      }])
        .then((user) => {
          expect(user).to.be.null;
        })
        .catch((error) => {
          expect(error).to.not.be.null;
        });
    });
  });

  describe('#createEmailConfirmToken', () => {

    it('should create a token for a valid user', async () => {
      const token = await UsersService.createEmailConfirmToken(mockUsers[0].id, mockUsers[0].profiles[0].id);
      expect(token).to.not.be.null;
    });

    it('should not create a token for a user already verified', async () => {
      const token = await UsersService.createEmailConfirmToken(mockUsers[0].id, mockUsers[0].profiles[0].id);
      expect(token).to.not.be.null;

      await UsersService.verifyEmailConfirmation(token);

      return expect(UsersService.createEmailConfirmToken(mockUsers[0].id, mockUsers[0].profiles[0].id)).to.eventually.be.rejected;
    });

  });

  describe('#verifyEmailConfirmation', () => {

    it('should correctly validate a valid token', async () => {
      const token = await UsersService.createEmailConfirmToken(mockUsers[0].id, mockUsers[0].profiles[0].id);
      expect(token).to.not.be.null;

      return expect(UsersService.verifyEmailConfirmation(token)).to.eventually.not.be.rejected;
    });

    it('should correctly reject an invalid token', async () => {
      return UsersService
        .verifyEmailConfirmation('cats')
        .catch((err) => {
          expect(err).to.not.be.null;
        });
    });

    it('should update the user model when verification is complete', () => {
      return UsersService
        .createEmailConfirmToken(mockUsers[0].id, mockUsers[0].profiles[0].id)
        .then((token) => {
          expect(token).to.not.be.null;

          return UsersService.verifyEmailConfirmation(token);
        })
        .then(() => {
          return UsersService.findById(mockUsers[0].id);
        })
        .then((user) => {
          expect(user.profiles[0]).to.have.property('metadata');
          expect(user.profiles[0].metadata).to.have.property('confirmed_at');
          expect(user.profiles[0].metadata.confirmed_at).to.not.be.null;
        });
    });

  });

  describe('#setStatus', () => {
    it('should set the status to active', () => {
      return UsersService
        .setStatus(mockUsers[0].id, 'ACTIVE')
        .then(() => UsersService.findById(mockUsers[0].id))
        .then((user) => {
          expect(user).to.have.property('status', 'ACTIVE');
        });
    });
  });

  describe('#ignoreUser', () => {
    it('should add user id to ignoredUsers set', async () => {
      const user = mockUsers[0];
      const usersToIgnore = [mockUsers[1], mockUsers[2]];
      await UsersService.ignoreUsers(user.id, usersToIgnore.map((u) => u.id));
      const userAfterIgnoring = await UsersService.findById(user.id);
      expect(userAfterIgnoring.ignoresUsers.length).to.equal(2);

      // ignore same user another time, make sure it's not added to the list.
      await UsersService.ignoreUsers(user.id, usersToIgnore.slice(0, 1).map((u) => u.id));
      const userAfterIgnoring2 = await UsersService.findById(user.id);
      expect(userAfterIgnoring2.ignoresUsers.length).to.equal(2);
    });
  });

  describe('#ban', () => {
    it('should set the status to banned', () => {
      return UsersService
        .setStatus(mockUsers[0].id, 'BANNED')
        .then(() => UsersService.findById(mockUsers[0].id))
        .then((user) => {
          expect(user).to.have.property('status', 'BANNED');
        });
    });

    it('should still disable and ban the user if there is no comment', () => {
      return UsersService
        .setStatus(mockUsers[0].id, 'BANNED')
        .then(() => UsersService.findById(mockUsers[0].id))
        .then((user) => {
          expect(user).to.have.property('status', 'BANNED');
        });
    });
  });

  describe('#unban', () => {
    it('should set the status to active', () => {
      return UsersService
        .setStatus(mockUsers[0].id, 'ACTIVE')
        .then(() => UsersService.findById(mockUsers[0].id))
        .then((user) => {
          expect(user).to.have.property('status', 'ACTIVE');
        });
    });
  });

  describe('#toggleNameEdit', () => {
    it('should toggle the canEditName field', () => {
      return UsersService
        .toggleNameEdit(mockUsers[0].id, true)
        .then(() => UsersService.findById(mockUsers[0].id))
        .then((user) => {
          expect(user).to.have.property('canEditName', true);
        });
    });
  });

  describe('#editName', () => {
    it('should let the user edit their username if the proper toggle is set', () => {
      return UsersService
        .toggleNameEdit(mockUsers[0].id, true)
        .then(() => UsersService.editName(mockUsers[0].id, 'Jojo'))
        .then(() => UsersService.findById(mockUsers[0].id))
        .then((user) => {
          expect(user).to.have.property('username', 'Jojo');
          expect(user).to.have.property('canEditName', false);
        });
    });

    it('should let the user submit the same username if user is not banned (create username)', () => {
      return UsersService
        .toggleNameEdit(mockUsers[0].id, true)
        .then(() => UsersService.editName(mockUsers[0].id, mockUsers[0].username))
        .then(() => UsersService.findById(mockUsers[0].id))
        .then((user) => {
          expect(user).to.have.property('username', mockUsers[0].username);
          expect(user).to.have.property('canEditName', false);
        });
    });

    it('should return error when a banned user submits the same username (rejected username)', () => {
      return UsersService
        .toggleNameEdit(mockUsers[0].id, true)
        .then(() => UsersService.setStatus(mockUsers[0].id, 'BANNED'))
        .then(() => UsersService.editName(mockUsers[0].id, mockUsers[0].username))
        .then(() => UsersService.findById(mockUsers[0].id))
        .then(() => {
          throw new Error('Error expected');
        })
        .catch((err) => {
          expect(err.status).to.equal(400);
          expect(err.translation_key).to.equal('SAME_USERNAME_PROVIDED');
        });
    });

    it('should return an error if canEditName is false', async () => {
      return expect(UsersService.editName(mockUsers[0].id, 'Jojo')).to.eventually.be.rejected;
    });

    it('should return an error if the username is already taken', async () => {
      await UsersService.toggleNameEdit(mockUsers[0].id, true);
      return expect(UsersService.editName(mockUsers[0].id, 'Marvel')).to.eventually.be.rejected;
    });

    it('should not allow non-alphanumeric characters in usernames', () => {
      return UsersService
        .isValidUsername('hi🖕')
        .then(() => {
          expect(false).to.be.true;
        })
        .catch((err) => {
          expect(err).to.be.ok;
        });
    });
  });

});
