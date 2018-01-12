const UsersService = require('../../../services/users');
const SettingsService = require('../../../services/settings');
const mailer = require('../../../services/mailer');

const chai = require('chai');
chai.use(require('chai-as-promised'));
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const expect = chai.expect;

describe('services.UsersService', () => {
  let mockUsers;
  beforeEach(async () => {
    const settings = {
      id: '1',
      moderation: 'PRE',
      wordlist: { banned: ['bad words'], suspect: ['suspect words'] },
    };

    await SettingsService.init(settings);
    mockUsers = await UsersService.createLocalUsers([
      {
        email: 'stampi@gmail.com',
        username: 'Stampi',
        password: '1Coral!-',
      },
      {
        email: 'sockmonster@gmail.com',
        username: 'Sockmonster',
        password: '2Coral!2',
      },
      {
        email: 'marvel@gmail.com',
        username: 'Marvel',
        password: '3Coral!3',
      },
    ]);

    sinon.spy(mailer, 'send');
  });

  afterEach(() => {
    mailer.send.restore();
  });

  describe('#findById()', () => {
    it('should find a user by id', async () => {
      const user = await UsersService.findById(mockUsers[0].id);
      expect(user).to.have.property('username', 'Stampi');
    });
  });

  describe('#findByIdArray()', () => {
    it('should find an array of users from an array of ids', async () => {
      const ids = mockUsers.map(user => user.id);
      const users = await UsersService.findByIdArray(ids);
      expect(users).to.have.length(3);
    });
  });

  describe('#findPublicByIdArray()', () => {
    it('should find an array of users from an array of ids', async () => {
      const ids = mockUsers.map(user => user.id);
      const users = await UsersService.findPublicByIdArray(ids);
      expect(users).to.have.length(3);

      const sorted = users.sort((a, b) => {
        if (a.username < b.username) {
          return -1;
        }
        if (a.username > b.username) {
          return 1;
        }
        return 0;
      });
      expect(sorted[0]).to.have.property('username', 'Marvel');
    });
  });

  describe('#findLocalUser', () => {
    it('should find a user', () => {
      return UsersService.findLocalUser(mockUsers[0].profiles[0].id).then(
        user => {
          expect(user).to.have.property('username', mockUsers[0].username);
        }
      );
    });
  });

  describe('#createLocalUser', () => {
    it('should not create a user with duplicate username', () => {
      return UsersService.createLocalUsers([
        {
          email: 'otrostampi@gmail.com',
          username: 'StampiTheSecond',
          password: '1Coralito!',
        },
      ])
        .then(user => {
          expect(user).to.be.null;
        })
        .catch(error => {
          expect(error).to.not.be.null;
        });
    });
  });

  describe('#createEmailConfirmToken', () => {
    it('should create a token for a valid user', async () => {
      const token = await UsersService.createEmailConfirmToken(
        mockUsers[0],
        mockUsers[0].profiles[0].id
      );
      expect(token).to.not.be.null;
    });

    it('should not create a token for a user already verified', async () => {
      const token = await UsersService.createEmailConfirmToken(
        mockUsers[0],
        mockUsers[0].profiles[0].id
      );
      expect(token).to.not.be.null;

      await UsersService.verifyEmailConfirmation(token);

      const user = await UsersService.findById(mockUsers[0].id);

      return expect(
        UsersService.createEmailConfirmToken(user, mockUsers[0].profiles[0].id)
      ).to.eventually.be.rejected;
    });
  });

  describe('#verifyEmailConfirmation', () => {
    it('should correctly validate a valid token', async () => {
      const token = await UsersService.createEmailConfirmToken(
        mockUsers[0],
        mockUsers[0].profiles[0].id
      );
      expect(token).to.not.be.null;

      return expect(UsersService.verifyEmailConfirmation(token)).to.eventually
        .not.be.rejected;
    });

    it('should correctly reject an invalid token', async () => {
      return UsersService.verifyEmailConfirmation('cats').catch(err => {
        expect(err).to.not.be.null;
      });
    });

    it('should update the user model when verification is complete', () => {
      return UsersService.createEmailConfirmToken(
        mockUsers[0],
        mockUsers[0].profiles[0].id
      )
        .then(token => {
          expect(token).to.not.be.null;

          return UsersService.verifyEmailConfirmation(token);
        })
        .then(() => {
          return UsersService.findById(mockUsers[0].id);
        })
        .then(user => {
          expect(user.profiles[0]).to.have.property('metadata');
          expect(user.profiles[0].metadata).to.have.property('confirmed_at');
          expect(user.profiles[0].metadata.confirmed_at).to.not.be.null;
        });
    });
  });

  describe('#ignoreUser', () => {
    it('should add user id to ignoredUsers set', async () => {
      const user = mockUsers[0];
      const usersToIgnore = [mockUsers[1], mockUsers[2]];
      await UsersService.ignoreUsers(user.id, usersToIgnore.map(u => u.id));
      const userAfterIgnoring = await UsersService.findById(user.id);
      expect(userAfterIgnoring.ignoresUsers.length).to.equal(2);

      // ignore same user another time, make sure it's not added to the list.
      await UsersService.ignoreUsers(
        user.id,
        usersToIgnore.slice(0, 1).map(u => u.id)
      );
      const userAfterIgnoring2 = await UsersService.findById(user.id);
      expect(userAfterIgnoring2.ignoresUsers.length).to.equal(2);
    });

    it('should not ignore a staff member', async () => {
      const user = mockUsers[0];
      const usersToIgnore = [mockUsers[1]];
      await UsersService.setRole(usersToIgnore[0].id, 'STAFF');

      try {
        await UsersService.ignoreUsers(user.id, usersToIgnore.map(u => u.id));
      } catch (err) {
        expect(err.status).to.equal(400);
        expect(err.translation_key).to.equal('CANNOT_IGNORE_STAFF');
      }
    });
  });

  [
    {
      func: 'changeUsername',
      okStatus: 'REJECTED',
      notOKStatus: 'UNSET',
      newStatus: 'CHANGED',
    },
    {
      func: 'setUsername',
      okStatus: 'UNSET',
      notOKStatus: 'REJECTED',
      newStatus: 'SET',
    },
  ].forEach(({ func, okStatus, notOKStatus, newStatus }) => {
    describe(`#${func}`, () => {
      [
        { status: okStatus },
        { error: 'EDIT_USERNAME_NOT_AUTHORIZED', status: notOKStatus },
        { error: 'EDIT_USERNAME_NOT_AUTHORIZED', status: 'SET' },
        { error: 'EDIT_USERNAME_NOT_AUTHORIZED', status: 'APPROVED' },
        { error: 'EDIT_USERNAME_NOT_AUTHORIZED', status: 'CHANGED' },
      ].forEach(({ status, error }) => {
        it(`${
          error ? 'should not' : 'should'
        } let them change the username if they have the status of ${status}`, async () => {
          const user = mockUsers[0];

          // Set the user to the desired status.
          await UsersService.setUsernameStatus(user.id, status);

          try {
            await UsersService[func](user.id, 'spock');
          } catch (err) {
            if (error) {
              expect(err).have.property('translation_key', error);
            } else {
              throw err;
            }
          }
        });
      });

      it(`should change the status to ${newStatus} when changed`, async () => {
        const user = mockUsers[0];

        // Set the user to the desired status.
        await UsersService.setUsernameStatus(user.id, okStatus);

        const editedUser = await UsersService[func](user.id, 'spock');

        expect(editedUser.status.username.status).to.equal(newStatus);

        try {
          await UsersService[func](user.id, 'spock');
          throw new Error('edit was processed successfully');
        } catch (err) {
          expect(err).have.property(
            'translation_key',
            'EDIT_USERNAME_NOT_AUTHORIZED'
          );
        }
      });

      it(`${
        func === 'changeUsername' ? 'should' : 'should not'
      } refuse changing the username to the same username`, async () => {
        const user = mockUsers[0];

        // Set the user to the desired status.
        await UsersService.setUsernameStatus(user.id, okStatus);

        if (func === 'changeUsername') {
          try {
            await UsersService[func](user.id, user.username);
            throw new Error('edit was processed successfully');
          } catch (err) {
            expect(err).have.property(
              'translation_key',
              'SAME_USERNAME_PROVIDED'
            );
          }
        } else {
          await UsersService[func](user.id, user.username);
        }
      });
    });
  });

  describe('#isValidUsername', () => {
    it('should not allow non-alphanumeric characters in usernames', () => {
      return UsersService.isValidUsername('hi🖕')
        .then(() => {
          expect(false).to.be.true;
        })
        .catch(err => {
          expect(err).to.be.ok;
        });
    });
  });
});
