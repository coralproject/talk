const passport = require('../../../passport');

const app = require('../../../../../app');
const mailer = require('../../../../../services/mailer');

const SettingsService = require('../../../../../services/settings');
const settings = {
  id: '1',
  moderation: 'PRE',
  wordlist: { banned: ['bad words'], suspect: ['suspect words'] },
};

const chai = require('chai');
chai.should();
chai.use(require('chai-http'));
const expect = chai.expect;

const UsersService = require('../../../../../services/users');

describe('/api/v1/users/:user_id/email/confirm', () => {
  let mockUser;

  beforeEach(() =>
    SettingsService.init(settings)
      .then(() => {
        return UsersService.createLocalUser(
          'ana@gmail.com',
          '123321123',
          'Ana'
        );
      })
      .then(user => {
        mockUser = user;
      })
  );

  describe('#post', () => {
    it('should send an email when we hit the endpoint', () => {
      expect(mailer.task.tasks).to.have.length(0);

      return chai
        .request(app)
        .post(`/api/v1/users/${mockUser.id}/email/confirm`)
        .set(passport.inject({ role: 'ADMIN' }))
        .then(res => {
          expect(res).to.have.status(204);
          expect(mailer.task.tasks).to.have.length(1);
        });
    });

    it('should send a 404 on not matching a user', () => {
      return chai
        .request(app)
        .post(`/api/v1/users/${mockUser.id}/email/confirm`)
        .set(passport.inject({ role: 'ADMIN' }))
        .then(res => {
          expect(res).to.have.status(204);
          expect(mailer.task.tasks).to.have.length(1);
        });
    });
  });
});
