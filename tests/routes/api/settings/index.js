process.env.NODE_ENV = 'test';

require('../../../utils/mongoose');

const app = require('../../../../app');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;

const Setting = require('../../../../models/setting');
const defaults = {id: '1', moderation: 'pre'};

describe('GET /settings', () => {

  beforeEach(() => {
    return Setting.update({id: '1'}, {$setOnInsert: defaults}, {upsert: true});
  });

  it('should return a settings object', done => {
    chai.request(app)
      .get('/api/v1/settings')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.property('moderation', 'pre');
        done(err);
      });
  });
});

// update the settings.
describe('update settings', () => {
  it('should respond ok to a PUT', () => {
    return Setting.update({id: '1'}, {$setOnInsert: defaults}, {upsert: true})
    .then(() => {
      return chai.request(app)
        .put('/api/v1/settings')
        .send({moderation: 'post'})
        .then(res => {
          expect(res).to.have.status(204);

          return Setting.getSettings();

        })
        .then(settings => {
          // confirm updated settings in db
          expect(settings).to.have.property('moderation');
          expect(settings.moderation).to.equal('post');
        })
        .catch(err => {
          throw err;
        });
    });
  });
});
