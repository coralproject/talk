require('../utils/mongoose');

const User = require('../../models/user');
const expect = require('chai').expect;

describe('User: models', () => {
  let mockUsers;
  beforeEach(() => {
    return User.createLocalUsers([{
      email: 'stampi@gmail.com',
      displayName: 'Stampi',
      password: '1Coral!'
    }, {
      email: 'sockmonster@gmail.com',
      displayName: 'Sockmonster',
      password: '2Coral!'
    }, {
      email: 'marvel@gmail.com',
      displayName: 'Marvel',
      password: '3Coral!'
    }]).then((users) => {
      mockUsers = users;
    });
  });

  describe('#findById()', () => {
    it('should find a user by id', () => {
      return User
        .findById(mockUsers[0].id)
        .then((user) => {
          expect(user).to.have.property('displayName')
            .and.to.equal('Stampi');
        });
    });
  });

  describe('#findByIdArray()', () => {
    it('should find an array of users from an array of ids', () => {
      const ids = mockUsers.map((user) => user.id);
      return User.findByIdArray(ids).then((result) => {
        expect(result).to.have.length(3);
      });
    });
  });

  describe('#findLocalUser', () => {

    it('should find a user when we give the right credentials', () => {
      return User
        .findLocalUser(mockUsers[0].profiles[0].id, '1Coral!')
        .then((user) => {
          expect(user).to.have.property('displayName')
            .and.to.equal(mockUsers[0].displayName);
        });
    });

    it('should not find the user when we give the wrong credentials', () => {
      return User
        .findLocalUser(mockUsers[0].profiles[0].id, '1Coral!<nope>')
        .then((user) => {
          expect(user).to.equal(false);
        });
    });

  });

  describe('#setStatus', () => {
    it('should set the status to banned', () => {
      return User
        .setStatus(mockUsers[0].id, 'banned')
        .then(() => {
          User.findById(mockUsers[0].id)
          .then((user) => {
            expect(user).to.have.property('status')
              .and.to.equal('banned');
          });
        });
    });
  });
});
