const passport = require('../../../passport');

const app = require('../../../../../app');

const UsersService = require('../../../../../services/users');
const SettingsService = require('../../../../../services/settings');
const settings = {id: '1', moderation: 'PRE', wordlist: {banned: ['bad words'], suspect: ['suspect words']}};

const chai = require('chai');
chai.should();
chai.use(require('chai-http'));
const expect = chai.expect;

describe('/api/v1/account/username', () => {
  let mockUser;
  beforeEach(async () => {
    await SettingsService.init(settings);
    mockUser = await UsersService.createLocalUser('ana@gmail.com', '123321123', 'Ana');
  });

  describe('#put', () => {
    it('it should enable a user to edit their username if canEditName is enabled', async () => {
      await chai.request(app)
        .post(`/api/v1/users/${mockUser.id}/username-enable`)
        .set(passport.inject({id: '456', roles: ['ADMIN']}));

      const res = await chai.request(app)
        .put('/api/v1/account/username')
        .set(passport.inject({id: mockUser.id, roles: []}))
        .send({username: 'MojoJojo'});

      expect(res).to.have.status(204);
    });

    it('it should return an error if the wrong user tries to edit a username', async () => {
      await chai.request(app)
        .post(`/api/v1/users/${mockUser.id}/username-enable`)
        .set(passport.inject({id: '456', roles: ['ADMIN']}));

      let res = chai.request(app)
        .put('/api/v1/account/username')
        .set(passport.inject({id: 'wrongid', roles: []}))
        .send({username: 'MojoJojo'});

      return expect(res).to.eventually.be.rejected;
    });

    it('it should return an error when the user tries to edit their username if canEditName is disabled', () => {
      let res = chai.request(app)
        .put('/api/v1/account/username')
        .set(passport.inject({id: mockUser.id, roles: []}))
        .send({username: 'MojoJojo'});

      return expect(res).to.eventually.be.rejected;
    });
  });
});
