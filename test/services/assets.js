const AssetModel = require('../../models/asset');
const AssetsService = require('../../services/assets');

const chai = require('chai');
const expect = chai.expect;

// Use the chai should.
chai.should();

describe('services.AssetsService', () => {

  beforeEach(() => {
    const defaults = {url:'http://test.com'};
    return AssetModel.update({id: '1'}, {$setOnInsert: defaults}, {upsert: true});
  });

  describe('#findById', ()=> {
    it('should find an asset by the id', () => {
      return AssetsService.findById(1)
        .then((asset) => {
          expect(asset).to.have.property('url')
            .and.to.equal('http://test.com');
        });
    });
  });

  describe('#findByUrl', ()=> {
    beforeEach(() => AssetsService.findOrCreateByUrl('http://test.com'));

    it('should find an asset by a url', () => {
      return AssetsService
        .findByUrl('http://test.com')
        .then((asset) => {
          expect(asset).to.have.property('url', 'http://test.com');
        });
    });

    it('should return null when a url does not exist', () => {
      return AssetsService
        .findByUrl('http://new.test.com')
        .then((asset) => {
          expect(asset).to.be.null;
        });
    });
  });

  describe('#findOrCreateByUrl', ()=> {
    it('should find an asset by a url', () => {
      return AssetsService
        .findOrCreateByUrl('http://test.com')
        .then((asset) => {
          expect(asset).to.have.property('url')
            .and.to.equal('http://test.com');
        });
    });

    it('should return a new asset when the url does not exist', () => {
      return AssetsService
        .findOrCreateByUrl('http://new.test.com')
        .then((asset) => {
          expect(asset).to.have.property('id')
            .and.to.not.equal(1);
        });
    });
  });

  describe('#overrideSettings', () => {
    it('should update the settings', () => {
      return AssetsService
        .findOrCreateByUrl('https://override.test.com/asset')
        .then((asset) => {
          expect(asset).to.have.property('settings');
          expect(asset.settings).to.be.null;

          return AssetsService.overrideSettings(asset.id, {moderation: 'PRE'});
        })
        .then(() => {
          return AssetsService.findOrCreateByUrl('https://override.test.com/asset');
        })
        .then((asset) => {
          expect(asset).to.have.property('settings');
          expect(asset.settings).is.an('object');
          expect(asset.settings).to.have.property('moderation', 'PRE');
        });
    });
  });

  describe('#findOrCreateByUrl', ()=> {
    it('should find an asset by a url', () => {
      return AssetsService
        .findOrCreateByUrl('http://test.com')
        .then((asset) => {
          expect(asset).to.have.property('url')
            .and.to.equal('http://test.com');
        });
    });

    it('should return a new asset when the url does not exist', () => {
      return AssetsService
        .findOrCreateByUrl('http://new.test.com')
        .then((asset) => {
          expect(asset).to.have.property('id')
            .and.to.not.equal(1);
        });
    });
  });
});
