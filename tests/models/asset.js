const Asset = require('../../models/asset');
const expect = require('chai').expect;

describe('Asset: model', () => {

  beforeEach(() => {
    const defaults = {url:'http://test.com'};
    return Asset.update({id: '1'}, {$setOnInsert: defaults}, {upsert: true});
  });

  describe('#findById', ()=> {
    it('should find an asset by the id', () => {
      return Asset.findById(1)
        .then((asset) => {
          expect(asset).to.have.property('url')
            .and.to.equal('http://test.com');
        });
    });
  });

  describe('#findByUrl', ()=> {
    it('should find an asset by a url', () => {
      return Asset.findByUrl('http://test.com')
        .then((asset) => {
          expect(asset).to.have.property('url')
            .and.to.equal('http://test.com');
        });
    });

    it('should return null when a url does not exist', () => {
      return Asset.findByUrl('http://new.test.com')
        .then((asset) => {
          expect(asset).to.be.null;
        });
    });
  });

  describe('#findOrCreateByUrl', ()=> {
    it('should find an asset by a url', () => {
      return Asset.findOrCreateByUrl('http://test.com')
        .then((asset) => {
          expect(asset).to.have.property('url')
            .and.to.equal('http://test.com');
        });
    });

    it('should return a new asset when the url does not exist', () => {
      return Asset.findOrCreateByUrl('http://new.test.com')
        .then((asset) => {
          expect(asset).to.have.property('id')
            .and.to.not.equal(1);
        });
    });
  });

  describe('#findOrCreateByUrl', ()=> {
    it('should find an asset by a url', () => {
      return Asset.findOrCreateByUrl('http://test.com')
        .then((asset) => {
          expect(asset).to.have.property('url')
            .and.to.equal('http://test.com');
        });
    });

    it('should return a new asset when the url does not exist', () => {
      return Asset.findOrCreateByUrl('http://new.test.com')
        .then((asset) => {
          expect(asset).to.have.property('id')
            .and.to.not.equal(1);
        });
    });
  });
});
