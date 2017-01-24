const passport = require('../../../passport');

const app = require('../../../../app');
const chai = require('chai');
const expect = chai.expect;

chai.should();
chai.use(require('chai-http'));

const SettingsService = require('../../../../services/settings');
const defaults = {id: '1', moderation: 'pre'};

describe('/api/v1/settings', () => {

  beforeEach(() => SettingsService.init(defaults));

  describe('#get', () => {

    it('should return a settings object', () => {
      return chai.request(app)
        .get('/api/v1/settings')
        .set(passport.inject({
          roles: ['admin']
        }))
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.have.property('moderation', 'pre');
        });
    });
  });

  describe('#put', () => {

    it('should update the settings', () => {
      return chai.request(app)
        .put('/api/v1/settings')
        .set(passport.inject({roles: ['admin']}))
        .send({moderation: 'post'})
        .then((res) => {
          expect(res).to.have.status(204);

          return SettingsService.retrieve();
        })
        .then((settings) => {
          expect(settings).to.have.property('moderation', 'post');
        });
    });
  });

});
