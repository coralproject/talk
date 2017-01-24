const passport = require('../../../passport');

const app = require('../../../../app');
const chai = require('chai');
const expect = chai.expect;

// Setup chai.
chai.should();
chai.use(require('chai-http'));

const AssetModel = require('../../../../models/asset');
const AssetsService = require('../../../../services/assets');

describe('/api/v1/assets', () => {

  beforeEach(() => {
    return AssetModel.create([
      {
        url: 'https://coralproject.net/news/asset1',
        title: 'Asset 1',
        description: 'term1',
        closedAt: Date.now()
      },
      {
        url: 'https://coralproject.net/news/asset2',
        title: 'Asset 2',
        description: 'term2',
        closedAt: null
      }
    ]);
  });

  describe('#get', () => {

    it('should return all assets without a search query', () => {
      return chai.request(app)
        .get('/api/v1/assets')
        .set(passport.inject({roles: ['ADMIN']}))
        .then((res) => {
          const body = res.body;

          expect(body).to.have.property('count', 2);
          expect(body).to.have.property('result');

          const assets = body.result;

          expect(assets).to.have.length(2);
        });
    });

    it('should return assets that we search for', () => {
      return chai.request(app)
        .get('/api/v1/assets?search=term2')
        .set(passport.inject({roles: ['ADMIN']}))
        .then((res) => {
          const body = res.body;

          expect(body).to.have.property('count', 1);
          expect(body).to.have.property('result');

          const assets = body.result;

          expect(assets).to.have.length(1);

          const asset = assets[0];

          expect(asset).to.have.property('url', 'https://coralproject.net/news/asset2');
          expect(asset).to.have.property('title', 'Asset 2');
        });
    });

    it('should not return assets that we do not search for', () => {
      return chai.request(app)
        .get('/api/v1/assets?search=term3')
        .set(passport.inject({roles: ['ADMIN']}))
        .then((res) => {
          const body = res.body;

          expect(body).to.have.property('count', 0);
          expect(body).to.have.property('result');

          expect(body.result).to.be.empty;
        });
    });

    it('should return only closed assets', () => {
      return chai.request(app)
        .get('/api/v1/assets?filter=closed')
        .set(passport.inject({roles: ['ADMIN']}))
        .then((res) => {
          const body = res.body;

          expect(body).to.have.property('count', 1);
          expect(body).to.have.property('result');

          const assets = body.result;

          expect(assets[0]).to.have.property('title', 'Asset 1');
        });
    });

    it('should return only opened assets', () => {
      return chai.request(app)
        .get('/api/v1/assets?filter=open')
        .set(passport.inject({roles: ['ADMIN']}))
        .then((res) => {
          const body = res.body;

          expect(body).to.have.property('count', 1);
          expect(body).to.have.property('result');

          const assets = body.result;

          expect(assets[0]).to.have.property('title', 'Asset 2');
        });
    });

  });

  describe('#put', () => {
    it('should close the asset', function() {

      const today = Date.now();

      return AssetsService.findOrCreateByUrl('http://test.com')
        .then((asset) => {
          expect(asset).to.have.property('isClosed', null);
          expect(asset).to.have.property('closedAt', null);

          return chai.request(app)
            .put(`/api/v1/assets/${asset.id}/status`)
            .set(passport.inject({roles: ['ADMIN']}))
            .send({closedAt: today});
        })
        .then((res) => {

          expect(res).to.have.status(204);

          return AssetsService.findByUrl('http://test.com');
        })
        .then((asset) => {
          expect(asset).to.have.property('isClosed', true);
          expect(asset).to.have.property('closedAt').and.to.not.equal(null);
        });
    });
  });

});
