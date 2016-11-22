require('../utils/mongoose');

const User = require('../../models/user');
const Comment = require('../../models/comment');
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

  describe('#findPublicByIdArray()', () => {
    it('should find an array of users from an array of ids', () => {
      const ids = mockUsers.map((user) => user.id);
      return User.findPublicByIdArray(ids).then((result) => {
        expect(result).to.have.length(3);
        const sorted = result.sort((a, b) =>     {
          if(a.displayName < b.displayName) {return -1;}
          if(a.displayName > b.displayName) {return 1;}
          return 0;
        });
        expect(sorted[0]).to.have.property('displayName')
          .and.to.equal('Marvel');
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
    it('should set the status to active', () => {
      return User
        .setStatus(mockUsers[0].id, 'active')
        .then(() => {
          User.findById(mockUsers[0].id)
          .then((user) => {
            expect(user).to.have.property('status')
              .and.to.equal('active');
          });
        });
    });
  });

  describe('#ban', () => {
    let mockComment;
    beforeEach(() => {
      return Comment.new('testing the comment for that user if it is rejected.', mockUsers[0].id)
      .then((comment) => {
        mockComment = comment;
      });
    });

    it('should disable the user', () => {
      return User
        .setStatus(mockUsers[0].id, 'banned', mockComment.id)
        .then(() => {
          User.findById(mockUsers[0].id)
          .then((user) => {
            expect(user).to.have.property('disabled')
              .and.to.equal(true);
          });
        });
    });

    it('should set the status to banned', () => {
      return User
        .setStatus(mockUsers[0].id, 'banned', mockComment.id)
        .then(() => {
          User.findById(mockUsers[0].id)
          .then((user) => {
            expect(user).to.have.property('status')
              .and.to.equal('banned');
          });
        });
    });

    it('should set the comment to rejected', () => {
      return User
        .setStatus(mockUsers[0].id, 'banned', mockComment.id)
        .then(() => {
          Comment.findById(mockComment.id)
          .then((comment) => {
            expect(comment).to.have.property('status')
              .and.to.equal('rejected');
          });
        });
    });

    it('should still disable and ban the user if there is no comment', () => {
      return User
        .setStatus(mockUsers[0].id, 'banned', '')
        .then(() => {
          User.findById(mockUsers[0].id)
          .then((user) => {
            expect(user).to.have.property('status')
              .and.to.equal('banned');
            expect(user).to.have.property('disabled')
              .and.to.equal(true);
          });
        });
    });
  });

  describe('#unban', () => {
    let mockComment;
    beforeEach(() => {
      return Comment.new('testing the comment for that user if it is rejected.', mockUsers[0].id)
      .then((comment) => {
        mockComment = comment;
      });
    });

    it('should enable the user', () => {
      return User
        .setStatus(mockUsers[0].id, 'active', mockComment.id)
        .then(() => {
          User.findById(mockUsers[0].id)
          .then((user) => {
            expect(user).to.have.property('disabled')
              .and.to.equal(false);
          });
        });
    });

    it('should set the status to active', () => {
      return User
        .setStatus(mockUsers[0].id, 'active', mockComment.id)
        .then(() => {
          User.findById(mockUsers[0].id)
          .then((user) => {
            expect(user).to.have.property('status')
              .and.to.equal('active');
          });
        });
    });
  });
});
