const app = require('../../../../app');
const chai = require('chai');
const expect = chai.expect;

chai.use(require('chai-http'));

const User = require('../../../../models/user');

describe('/api/v1/auth', () => {
  describe('#get', () => {
    it('should return nothing when no user is logged in', () => {
      return chai.request(app)
        .get('/api/v1/auth')
        .then((res) => {
          expect(res.status).to.be.equal(204);
          expect(res).to.not.have.a.body;
        });
    });
  });
});

const Setting = require('../../../../models/setting');

describe('/api/v1/auth/local', () => {

  let mockUser;
  beforeEach(() => {
    const settings = {requireEmailConfirmation: false, wordlist: {banned: ['bad'], suspect: ['naughty']}};
    return Setting.init(settings).then(() => {
      return User.createLocalUser('maria@gmail.com', 'password!', 'Maria')
        .then((user) => {
          mockUser = user;
        });
    });
  });

  describe('email confirmation disabled', () => {

    describe('#post', () => {
      it('should send back the user on a successful login', () => {
        return chai.request(app)
          .post('/api/v1/auth/local')
          .send({email: 'maria@gmail.com', password: 'password!'})
          .then((res2) => {
            expect(res2).to.have.status(200);
            expect(res2).to.be.json;
            expect(res2.body).to.have.property('user');
            expect(res2.body.user).to.have.property('displayName', 'maria');
          });
      });

      it('should not send back the user on a unsuccessful login', () => {
        return chai.request(app)
          .post('/api/v1/auth/local')
            .send({email: 'maria@gmail.com', password: 'password!3'})
            .catch((err) => {
              expect(err).to.not.be.null;
              expect(err.response).to.have.status(401);
              expect(err.response.body).to.have.property('message', 'not authorized');
            });
      });

    });

  });

  describe('email confirmation enabled', () => {

    beforeEach(() => Setting.init({requireEmailConfirmation: true}));

    describe('#post', () => {
      it('should not allow a login from a user that is not confirmed', () => {
        return chai.request(app)
          .post('/api/v1/auth/local')
          .send({email: 'maria@gmail.com', password: 'password!'})
          .catch((err) => {
            err.response.should.have.status(401);

            return User.createEmailConfirmToken(mockUser.id, mockUser.profiles[0].id);
          })
          .then(User.verifyEmailConfirmation)
          .then(() => {
            return chai.request(app)
              .post('/api/v1/auth/local')
              .send({email: 'maria@gmail.com', password: 'password!'});
          })
          .then((res) => {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.have.property('user');
            expect(res.body.user).to.have.property('displayName', 'maria');
          });
      });
    });
  });
});
