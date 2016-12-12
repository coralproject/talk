const passport = require('../../../passport');

const app = require('../../../../app');
const chai = require('chai');
const expect = chai.expect;

// Setup chai.
chai.should();
chai.use(require('chai-http'));

const Asset = require('../../../../models/asset');

describe('/api/v1/assets', () => {

  beforeEach(() => {
    return Asset.create([
      {
        url: 'https://coralproject.net/news/asset1',
        title: 'Asset 1',
        description: 'term1',
        id: '1'
      },
      {
        url: 'https://coralproject.net/news/asset2',
        title: 'Asset 2',
        description: 'term2'
      }
    ]);
  });

  describe('#get', () => {

    it('should return all assets without a search query', () => {
      return chai.request(app)
        .get('/api/v1/asset')
        .set(passport.inject({roles: ['admin']}))
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
        .get('/api/v1/asset?search=term2')
        .set(passport.inject({roles: ['admin']}))
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
        .get('/api/v1/asset?search=term3')
        .set(passport.inject({roles: ['admin']}))
        .then((res) => {
          const body = res.body;

          expect(body).to.have.property('count', 0);
          expect(body).to.have.property('result');

          expect(body.result).to.be.empty;
        });
    });

  });

  describe('#put', () => {
    it('should close the asset', function() {

      const asset = Asset.findByUrl('http://test.com')
        .then((asset) => {
          expect(asset).to.have.property('closedAt')
            .and.to.equal(null);
        });

      const today = Date.now();
      return chai.request(app)
        .put(`/api/v1/asset/${asset.id}/status`)
        .set(passport.inject({roles: ['admin']}))
        .send({closedAt: today})
        .then((res) => {
          expect(res).to.have.status(201);

          Asset.findByUrl('http://test.com')
            .then((asset) => {
              expect(asset).to.have.property('isClosed')
                .and.to.equal(true);
              expect(asset).to.have.property('closedAt')
                .and.to.not.equal(null);
            });
        });
    });
  });

});
