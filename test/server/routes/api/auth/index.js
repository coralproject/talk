const app = require('../../../../../app');

const chai = require('chai');
chai.should();
chai.use(require('chai-http'));
const expect = chai.expect;

const UsersService = require('../../../../../services/users');

describe('/api/v1/auth', () => {
  describe('#get', () => {
    it('should return nothing when no user is logged in', () => {
      return chai
        .request(app)
        .get('/api/v1/auth')
        .then(res => {
          expect(res.status).to.be.equal(204);
          expect(res).to.not.have.a.body;
        });
    });
  });
});

const SettingsService = require('../../../../../services/settings');

describe('/api/v1/auth/local', () => {
  let mockUser;
  beforeEach(async () => {
    const settings = {
      requireEmailConfirmation: false,
      wordlist: { banned: ['bad'], suspect: ['naughty'] },
    };
    await SettingsService.init(settings);

    mockUser = await UsersService.createLocalUser(
      'maria@gmail.com',
      'password!',
      'Maria'
    );
  });

  describe('email confirmation disabled', () => {
    describe('#post', () => {
      it('should send back the user on a successful login', () => {
        return chai
          .request(app)
          .post('/api/v1/auth/local')
          .send({ email: 'maria@gmail.com', password: 'password!' })
          .then(res2 => {
            expect(res2).to.have.status(200);
            expect(res2).to.be.json;
            expect(res2.body).to.have.property('user');
            expect(res2.body.user).to.have.property('username', 'Maria');
          });
      });

      it('should not send back the user on a unsuccessful login', () => {
        return chai
          .request(app)
          .post('/api/v1/auth/local')
          .send({ email: 'maria@gmail.com', password: 'password!3' })
          .catch(err => {
            expect(err).to.not.be.null;
            expect(err.response).to.have.status(401);
            expect(err.response.body).to.have.property(
              'message',
              'You are not authorized to perform this action.'
            );
          });
      });
    });
  });

  describe('email confirmation enabled', () => {
    beforeEach(() =>
      SettingsService.update({ requireEmailConfirmation: true })
    );

    describe('#post', () => {
      it('should not allow a login from a user that is not confirmed', () => {
        return chai
          .request(app)
          .post('/api/v1/auth/local')
          .send({ email: 'maria@gmail.com', password: 'password!' })
          .catch(err => {
            expect(err).to.have.status(401);
            err.response.body.should.have.property('error');

            return UsersService.createEmailConfirmToken(
              mockUser,
              mockUser.profiles[0].id
            );
          })
          .then(UsersService.verifyEmailConfirmation)
          .then(() => {
            return chai
              .request(app)
              .post('/api/v1/auth/local')
              .send({ email: 'maria@gmail.com', password: 'password!' });
          })
          .then(res => {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.have.property('user');
            expect(res.body.user).to.have.property('username', 'Maria');
          });
      });
    });
  });
});
