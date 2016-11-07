/* eslint-env node, mocha */

require('../utils/mongoose');
const User = require('../../models/user');
const expect = require('chai').expect;

describe('User: models', () => {
  var mockUsers;
  beforeEach(() => {
    return User.create([{
      display_name: 'Stampi',
    },{
      display_name: 'Sockmonster',
    },{
      display_name: 'Marvel',
    }]).then((users) => {
      mockUsers = users;
    });
  });

  describe('#findById()', () => {
    it('should find a user by id', () => {
      return User.findById(mockUsers[0].id).then((result) => {
        expect(result).to.have.property('display_name')
          .and.to.equal('Stampi');
      });
    });
  });

  describe('#findByIdArray()', () => {
    it('should find an array of users from an array of ids', () => {
      const ids = mockUsers.map((user) => user.id)
      return User.findByIdArray(ids).then((result) => {
        expect(result).to.have.length(3);
      });
    });
  });

  // });
});
