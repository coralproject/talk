const passport = require('../../../passport');

const app = require('../../../../../app');

const chai = require('chai');
chai.use(require('chai-as-promised'));
chai.use(require('chai-http'));
const expect = chai.expect;

const AssetModel = require('../../../../../models/asset');
const AssetsService = require('../../../../../services/assets');
const SettingsService = require('../../../../../services/settings');

describe('/api/v1/assets', () => {
  beforeEach(async () => {
    const settings = {
      id: '1',
      moderation: 'PRE',
      domains: { whitelist: ['test.com'] },
    };

    await SettingsService.init(settings);

    await AssetModel.create([
      {
        url: 'https://coralproject.net/news/asset1',
        title: 'Asset 1',
        description: 'term1',
        closedAt: Date.now(),
      },
      {
        url: 'https://coralproject.net/news/asset2',
        title: 'Asset 2',
        description: 'term2',
        closedAt: null,
      },
    ]);
  });

  describe('#get', () => {
    it('should return all assets without a search query', async () => {
      for (const role of ['ADMIN', 'MODERATOR']) {
        const res = await chai
          .request(app)
          .get('/api/v1/assets')
          .set(passport.inject({ role }));

        const body = res.body;

        expect(body).to.have.property('count', 2);
        expect(body).to.have.property('result');

        const assets = body.result;

        expect(assets).to.have.length(2);
      }
    });

    it('should return assets that we search for', async () => {
      for (const role of ['ADMIN', 'MODERATOR']) {
        const res = await chai
          .request(app)
          .get('/api/v1/assets?value=term2')
          .set(passport.inject({ role }));

        const body = res.body;

        expect(body).to.have.property('count', 1);
        expect(body).to.have.property('result');

        const assets = body.result;

        expect(assets).to.have.length(1);

        const asset = assets[0];

        expect(asset).to.have.property(
          'url',
          'https://coralproject.net/news/asset2'
        );
        expect(asset).to.have.property('title', 'Asset 2');
      }
    });

    it('should not return assets that we do not search for', async () => {
      for (const role of ['ADMIN', 'MODERATOR']) {
        const res = await chai
          .request(app)
          .get('/api/v1/assets?value=term3')
          .set(passport.inject({ role }));
        const body = res.body;

        expect(body).to.have.property('count', 0);
        expect(body).to.have.property('result');

        expect(body.result).to.be.empty;
      }
    });

    it('should return only closed assets', async () => {
      for (const role of ['ADMIN', 'MODERATOR']) {
        const res = await chai
          .request(app)
          .get('/api/v1/assets?filter=closed')
          .set(passport.inject({ role }));
        const body = res.body;

        expect(body).to.have.property('count', 1);
        expect(body).to.have.property('result');

        const assets = body.result;

        expect(assets[0]).to.have.property('title', 'Asset 1');
      }
    });

    it('should return only opened assets', async () => {
      for (const role of ['ADMIN', 'MODERATOR']) {
        const res = await chai
          .request(app)
          .get('/api/v1/assets?filter=open')
          .set(passport.inject({ role }));
        const body = res.body;

        expect(body).to.have.property('count', 1);
        expect(body).to.have.property('result');

        const assets = body.result;

        expect(assets[0]).to.have.property('title', 'Asset 2');
      }
    });
  });

  describe('#put', () => {
    it('should close the asset', async () => {
      const today = Date.now();

      const asset = await AssetsService.findOrCreateByUrl('http://test.com');
      expect(asset).to.have.property('isClosed', false);
      expect(asset).to.have.property('closedAt', null);

      const res = await chai
        .request(app)
        .put(`/api/v1/assets/${asset.id}/status`)
        .set(passport.inject({ role: 'ADMIN' }))
        .send({ closedAt: today });

      expect(res).to.have.status(204);

      const closedAsset = await AssetsService.findByUrl('http://test.com');
      expect(closedAsset).to.have.property('isClosed', true);
      expect(closedAsset)
        .to.have.property('closedAt')
        .and.to.not.equal(null);
    });

    it('should require ADMIN role', async () => {
      const today = Date.now();

      const asset = await AssetsService.findOrCreateByUrl('http://test.com');
      expect(asset).to.have.property('isClosed', false);
      expect(asset).to.have.property('closedAt', null);

      const promise = chai
        .request(app)
        .put(`/api/v1/assets/${asset.id}/status`)
        .set(passport.inject({ role: 'MODERATOR' }))
        .send({ closedAt: today });
      await expect(promise).to.eventually.be.rejected;
    });
  });
});
