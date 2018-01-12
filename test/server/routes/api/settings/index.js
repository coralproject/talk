const passport = require('../../../passport');

const app = require('../../../../../app');

const chai = require('chai');
chai.should();
chai.use(require('chai-http'));
const expect = chai.expect;

const SettingsService = require('../../../../../services/settings');
const defaults = { id: '1', moderation: 'PRE' };

describe('/api/v1/settings', () => {
  beforeEach(() => SettingsService.init(defaults));

  describe('#get', () => {
    it('should return a settings object', async () => {
      for (let role of ['ADMIN', 'MODERATOR']) {
        const res = await chai
          .request(app)
          .get('/api/v1/settings')
          .set(passport.inject({ role }));
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.property('moderation', 'PRE');
      }
    });
  });

  describe('#put', () => {
    it('should update the settings', () => {
      return chai
        .request(app)
        .put('/api/v1/settings')
        .set(passport.inject({ role: 'ADMIN' }))
        .send({ moderation: 'POST' })
        .then(res => {
          expect(res).to.have.status(204);

          return SettingsService.retrieve();
        })
        .then(settings => {
          expect(settings).to.have.property('moderation', 'POST');
        });
    });

    it('should require ADMIN role', () => {
      const promise = chai
        .request(app)
        .put('/api/v1/settings')
        .set(passport.inject({ role: 'MODERATOR' }))
        .send({ moderation: 'POST' });
      return expect(promise).to.eventually.be.rejected;
    });
  });
});
