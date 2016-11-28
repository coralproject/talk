const passport = require('../../../passport');

const app = require('../../../../app');
const chai = require('chai');
const expect = chai.expect;

chai.should();
chai.use(require('chai-http'));

const Setting = require('../../../../models/setting');
const defaults = {id: '1', moderation: 'pre'};

describe('GET /settings', () => {

  beforeEach(() => {
    return Setting.update({id: '1'}, {$setOnInsert: defaults}, {upsert: true});
  });

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

// update the settings.
describe('update settings', () => {
  it('should respond ok to a PUT', () => {
    return Setting
      .update({id: '1'}, {$setOnInsert: defaults}, {upsert: true})
      .then(() => {
        return chai.request(app)
          .put('/api/v1/settings')
          .set(passport.inject({
            roles: ['admin']
          }))
          .send({moderation: 'post'});
      })
      .then(res => {
        expect(res).to.have.status(204);

        return Setting.getSettings();
      })
      .then(settings => {

        // confirm updated settings in db
        expect(settings).to.have.property('moderation');
        expect(settings.moderation).to.equal('post');
      });
  });
});
