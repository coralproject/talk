const passport = require('../../../passport');

const app = require('../../../../app');
const chai = require('chai');
const expect = chai.expect;

const SettingsService = require('../../../../services/settings');
const settings = {id: '1', moderation: 'PRE', wordlist: {banned: ['bad words'], suspect: ['suspect words']}};

// Setup chai.
chai.should();
chai.use(require('chai-http'));

const UsersService = require('../../../../services/users');

describe('/api/v1/account/username', () => {
  let mockUser;

  beforeEach(() => SettingsService.init(settings).then(() => {
    return UsersService.createLocalUser('ana@gmail.com', '123321123', 'Ana');
  })
  .then((user) => {
    mockUser = user;
  }));

  describe('#put', () => {
    it('it should enable a user to edit their username if canEditName is enabled', () => {
      return chai.request(app)
        .post(`/api/v1/users/${mockUser.id}/username-enable`)
        .set(passport.inject({id: '456', roles: ['ADMIN']}))
        .then(() => chai.request(app)
          .put('/api/v1/account/username')
          .set(passport.inject({id: mockUser.id, roles: []}))
          .send({username: 'MojoJojo'}))
        .then((res) => {
          expect(res).to.have.status(204);
        });
    });

    it('it should return an error if the wrong user tries to edit a username', (done) => {
      chai.request(app)
        .post(`/api/v1/users/${mockUser.id}/username-enable`)
        .set(passport.inject({id: '456', roles: ['ADMIN']}))
        .then(() => chai.request(app)
          .put('/api/v1/account/username')
          .set(passport.inject({id: 'wrongid', roles: []}))
          .send({username: 'MojoJojo'}))
        .then(() => {
          done(new Error('Exected Error'));
        })
        .catch((err) => {
          expect(err).to.be.truthy;
          done();
        });
    });

    it('it should return an error when the user tries to edit their username if canEditName is disabled', (done) => {
      chai.request(app)
        .put('/api/v1/account/username')
        .set(passport.inject({id: mockUser.id, roles: []}))
        .send({username: 'MojoJojo'})
        .then(() => {
          done(new Error('Exected Error'));
        })
        .catch((err) => {
          expect(err).to.be.truthy;
          done();
        });
    });
  });
});
