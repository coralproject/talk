const UsersService = require('../../../services/users');
const SettingsService = require('../../../services/settings');

const expect = require('chai').expect;

describe('services.UsersService', () => {

  let mockUsers;
  beforeEach(() => {
    const settings = {id: '1', moderation: 'PRE', wordlist: {banned: ['bad words'], suspect: ['suspect words']}};

    return SettingsService.init(settings).then(() => {
      return UsersService.createLocalUsers([{
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
      }]).then((users) => {
        mockUsers = users;
      });
    });
  });

  describe('#findById()', () => {
    it('should find a user by id', () => {
      return UsersService
        .findById(mockUsers[0].id)
        .then((user) => {
          expect(user).to.have.property('username', 'Stampi');
        });
    });
  });

  describe('#findByIdArray()', () => {
    it('should find an array of users from an array of ids', () => {
      const ids = mockUsers.map((user) => user.id);
      return UsersService.findByIdArray(ids).then((result) => {
        expect(result).to.have.length(3);
      });
    });
  });

  describe('#findPublicByIdArray()', () => {
    it('should find an array of users from an array of ids', () => {
      const ids = mockUsers.map((user) => user.id);
      return UsersService.findPublicByIdArray(ids).then((result) => {
        expect(result).to.have.length(3);
        const sorted = result.sort((a, b) =>     {
          if(a.username < b.username) {return -1;}
          if(a.username > b.username) {return 1;}
          return 0;
        });
        expect(sorted[0]).to.have.property('username', 'Marvel');
      });
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

    it('should create a token for a valid user', () => {
      return UsersService
        .createEmailConfirmToken(mockUsers[0].id, mockUsers[0].profiles[0].id)
        .then((token) => {
          expect(token).to.not.be.null;
        });
    });

    it('should not create a token for a user already verified', () => {
      return UsersService
        .createEmailConfirmToken(mockUsers[0].id, mockUsers[0].profiles[0].id)
        .then((token) => {
          expect(token).to.not.be.null;

          return UsersService.verifyEmailConfirmation(token);
        })
        .then(() => {
          return UsersService.createEmailConfirmToken(mockUsers[0].id, mockUsers[0].profiles[0].id);
        })
        .catch((err) => {
          expect(err).to.have.property('message', 'email address already confirmed');
        });
    });

  });

  describe('#verifyEmailConfirmation', () => {

    it('should correctly validate a valid token', () => {
      return UsersService
        .createEmailConfirmToken(mockUsers[0].id, mockUsers[0].profiles[0].id)
        .then((token) => {
          expect(token).to.not.be.null;

          return UsersService.verifyEmailConfirmation(token);
        });
    });

    it('should correctly reject an invalid token', () => {
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

    it('should return an error if canEditName is false', (done) => {
      UsersService
        .editName(mockUsers[0].id, 'Jojo')
        .then(() => UsersService.findById(mockUsers[0].id))
        .then(() => {
          done(new Error('Error expected'));
        })
        .catch((err) => {
          expect(err).to.be.truthy;
          done();
        });
    });

    it('should return an error if the username is already taken', (done) => {
      UsersService
      .toggleNameEdit(mockUsers[0].id, true)
      .then(() => UsersService.editName(mockUsers[0].id, 'Marvel'))
      .then(() => UsersService.findById(mockUsers[0].id))
      .then(() => {
        done(new Error('Error expected'));
      })
      .catch((err) => {
        expect(err).to.be.truthy;
        done();
      });
    });

    it('should not allow non-alphanumeric characters in usernames', () => {
      return UsersService
        .isValidUsername('hi🖕')
        .then(() => {
          expect(false).to.be.true;
        })
        .catch((err) => {
          expect(err).to.be.truthy;
        });
    });
  });

});
