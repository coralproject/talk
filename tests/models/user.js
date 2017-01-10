const User = require('../../models/user');
const Comment = require('../../models/comment');
const Setting = require('../../models/setting');

const expect = require('chai').expect;

describe('models.User', () => {
  let mockUsers;
  beforeEach(() => {
    const settings = {id: '1', moderation: 'pre', wordlist: {banned: ['bad words'], suspect: ['suspect words']}};

    return Setting.init(settings).then(() => {
      return User.createLocalUsers([{
        email: 'stampi@gmail.com',
        displayName: 'Stampi',
        password: '1Coral!-'
      }, {
        email: 'sockmonster@gmail.com',
        displayName: 'Sockmonster',
        password: '2Coral!2'
      }, {
        email: 'marvel@gmail.com',
        displayName: 'Marvel',
        password: '3Coral!3'
      }]).then((users) => {
        mockUsers = users;
      });
    });
  });

  describe('#findById()', () => {
    it('should find a user by id', () => {
      return User
        .findById(mockUsers[0].id)
        .then((user) => {
          expect(user).to.have.property('displayName')
            .and.to.equal('stampi');
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
          .and.to.equal('marvel');
      });
    });
  });

  describe('#findLocalUser', () => {

    it('should find a user when we give the right credentials', () => {
      return User
        .findLocalUser(mockUsers[0].profiles[0].id, '1Coral!-')
        .then((user) => {
          expect(user).to.have.property('displayName')
            .and.to.equal(mockUsers[0].displayName.toLowerCase());
        });
    });

    it('should not find the user when we give the wrong credentials', () => {
      return User
        .findLocalUser(mockUsers[0].profiles[0].id, '1Coral!-<nope>')
        .then((user) => {
          expect(user).to.equal(false);
        });
    });

  });

  describe('#createEmailConfirmToken', () => {

    it('should create a token for a valid user', () => {
      return User
        .createEmailConfirmToken(mockUsers[0].id, mockUsers[0].profiles[0].id)
        .then((token) => {
          expect(token).to.not.be.null;
        });
    });

    it('should not create a token for a user already verified', () => {
      return User
        .createEmailConfirmToken(mockUsers[0].id, mockUsers[0].profiles[0].id)
        .then((token) => {
          expect(token).to.not.be.null;

          return User.verifyEmailConfirmation(token);
        })
        .then(() => {
          return User.createEmailConfirmToken(mockUsers[0].id, mockUsers[0].profiles[0].id);
        })
        .catch((err) => {
          expect(err).to.have.property('message', 'email address already confirmed');
        });
    });

  });

  describe('#verifyEmailConfirmation', () => {

    it('should correctly validate a valid token', () => {
      return User
        .createEmailConfirmToken(mockUsers[0].id, mockUsers[0].profiles[0].id)
        .then((token) => {
          expect(token).to.not.be.null;

          return User.verifyEmailConfirmation(token);
        });
    });

    it('should correctly reject an invalid token', () => {
      return User
        .verifyEmailConfirmation('cats')
        .catch((err) => {
          expect(err).to.not.be.null;
        });
    });

    it('should update the user model when verification is complete', () => {
      return User
        .createEmailConfirmToken(mockUsers[0].id, mockUsers[0].profiles[0].id)
        .then((token) => {
          expect(token).to.not.be.null;

          return User.verifyEmailConfirmation(token);
        })
        .then(() => {
          return User.findById(mockUsers[0].id);
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
      return Comment.create([
        {
          body: 'testing the comment for that user if it is rejected.',
          id: mockUsers[0].id
        }
      ])
      .then(([comment]) => {
        mockComment = comment;
      });
    });

    it('should set the status to banned', () => {
      return User
        .setStatus(mockUsers[0].id, 'banned', mockComment.id)
        .then(() => {
          return User.findById(mockUsers[0].id);
        })
        .then((user) => {
          expect(user).to.have.property('status')
            .and.to.equal('banned');
        });
    });

    it('should set the comment to rejected', () => {
      return User
        .setStatus(mockUsers[0].id, 'banned', mockComment.id)
        .then(() => {
          return Comment.findById(mockComment.id);
        })
        .then((comment) => {
          expect(comment).to.have.property('status')
            .and.to.equal('rejected');
        });
    });

    it('should still disable and ban the user if there is no comment', () => {
      return User
        .setStatus(mockUsers[0].id, 'banned', '')
        .then(() => User.findById(mockUsers[0].id))
        .then((user) => {
          expect(user).to.have.property('status', 'banned');
        });
    });
  });

  describe('#unban', () => {
    let mockComment;
    beforeEach(() => {
      return Promise.all([
        Comment.create([{body: 'testing the comment for that user if it is rejected.', id: mockUsers[0].id}])
      ])
      .then((comment) => {
        mockComment = comment;
      });
    });

    it('should set the status to active', () => {
      return User
        .setStatus(mockUsers[0].id, 'active', mockComment.id)
        .then(() => User.findById(mockUsers[0].id))
        .then((user) => {
          expect(user).to.have.property('status', 'active');
        });
    });
  });
});
