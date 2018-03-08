const AssetModel = require('../../../models/asset');
const CommentModel = require('../../../models/comment');
const AssetsService = require('../../../services/assets');
const CommentsService = require('../../../services/comments');
const SettingsService = require('../../../services/settings');

const url = require('url');
const chai = require('chai');

chai.use(require('chai-as-promised'));
chai.should();

const expect = chai.expect;

const settings = {
  id: '1',
  moderation: 'PRE',
  domains: { whitelist: ['new.test.com', 'test.com', 'override.test.com'] },
};
const defaults = { url: 'http://test.com' };

describe('services.AssetsService', () => {
  let asset;
  beforeEach(async () => {
    await SettingsService.init(settings);

    asset = await AssetModel.findOneAndUpdate(
      { id: '1' },
      { $setOnInsert: defaults },
      { upsert: true, new: true }
    );
  });

  describe('#findById', () => {
    it('should find an asset by the id', () => {
      return AssetsService.findById(1).then(asset => {
        expect(asset)
          .to.have.property('url')
          .and.to.equal('http://test.com');
      });
    });
  });

  describe('#findByUrl', () => {
    beforeEach(() => AssetsService.findOrCreateByUrl('http://test.com'));

    it('should find an asset by a url', () => {
      return AssetsService.findByUrl('http://test.com').then(asset => {
        expect(asset).to.have.property('url', 'http://test.com');
      });
    });

    it('should return null when a url does not exist', () => {
      return AssetsService.findByUrl('http://new.test.com').then(asset => {
        expect(asset).to.be.null;
      });
    });
  });

  describe('#findOrCreateByUrl', () => {
    it('should find an asset by a url', () => {
      return AssetsService.findOrCreateByUrl('http://test.com').then(asset => {
        expect(asset)
          .to.have.property('url')
          .and.to.equal('http://test.com');
      });
    });

    it('should return a new asset when the url does not exist and its domain is whitelisted', () => {
      return AssetsService.findOrCreateByUrl('http://new.test.com').then(
        asset => {
          expect(asset)
            .to.have.property('id')
            .and.to.not.equal(1);
        }
      );
    });

    it('should return an error when the url does not exist and its domain is not whitelisted', () => {
      return AssetsService.findOrCreateByUrl('http://bad.test.com')
        .then(asset => {
          expect(asset).to.be.null;
        })
        .catch(error => {
          expect(error).to.not.be.null;
        });
    });
  });

  describe('#overrideSettings', () => {
    it('should update the settings', () => {
      return AssetsService.findOrCreateByUrl('https://override.test.com/asset')
        .then(asset => {
          expect(asset).to.have.property('settings');
          expect(asset.settings).to.be.empty;

          return AssetsService.overrideSettings(asset.id, {
            moderation: 'PRE',
          });
        })
        .then(() => {
          return AssetsService.findOrCreateByUrl(
            'https://override.test.com/asset'
          );
        })
        .then(asset => {
          expect(asset).to.have.property('settings');
          expect(asset.settings).is.an('object');
          expect(asset.settings).to.have.property('moderation', 'PRE');
        });
    });
  });

  describe('#findOrCreateByUrl', () => {
    it('should find an asset by a url', () => {
      return AssetsService.findOrCreateByUrl('http://test.com').then(asset => {
        expect(asset)
          .to.have.property('url')
          .and.to.equal('http://test.com');
      });
    });

    it('should return a new asset when the url does not exist', () => {
      return AssetsService.findOrCreateByUrl('http://new.test.com').then(
        asset => {
          expect(asset)
            .to.have.property('id')
            .and.to.not.equal(1);
        }
      );
    });
  });

  describe('#updateURL', () => {
    it('should change the url if the asset was found, and there was no conflict', async () => {
      let newURL = url.resolve(asset.url, '/new-url');

      // Update the asset.
      await AssetsService.updateURL(asset.id, newURL);

      // Check that the url was updated.
      let { url: databaseURL } = await AssetsService.findById(asset.id);

      expect(databaseURL).to.equal(newURL);
    });

    it('should error if the new url already exists', async () => {
      let newURL = url.resolve(asset.url, '/new-url');

      // Create a new asset with our new URL.
      await AssetModel.findOneAndUpdate(
        { id: '2' },
        { $setOnInsert: { url: newURL } },
        { upsert: true, new: true }
      );

      return AssetsService.updateURL(asset.id, newURL).should.eventually.be
        .rejected;
    });
  });

  describe('#merge', () => {
    it('should error if either the src or the dst is missing', () => {
      return AssetsService.merge('not-found', asset.id).should.eventually.be
        .rejected;
    });

    it('should merge the assets', async () => {
      let newURL = url.resolve(asset.url, '/new-url');

      // Create a new asset with our new URL.
      await AssetModel.findOneAndUpdate(
        { id: '2' },
        { $setOnInsert: { url: newURL } },
        { upsert: true, new: true }
      );

      // Create some comments on both assets.
      await Promise.all(
        [
          {
            asset_id: '1',
            body: 'This is a comment!',
            status: 'ACCEPTED',
          },
          {
            asset_id: '1',
            body: 'This is a comment!',
            status: 'ACCEPTED',
          },
          {
            asset_id: '2',
            body: 'This is a comment!',
            status: 'ACCEPTED',
          },
          {
            asset_id: '2',
            body: 'This is a comment!',
            status: 'ACCEPTED',
          },
        ].map(comment => CommentsService.publicCreate(comment))
      );

      // Merge all the comments from asset 1 into asset 2, followed by deleting
      // asset 1.
      await AssetsService.merge('1', '2');

      // Check to see if the comments are moved.
      expect(await CommentModel.find({ asset_id: '1' }).count()).to.equal(0);
      expect(await CommentModel.find({ asset_id: '2' }).count()).to.equal(4);

      // Check to see if the asset was removed.
      expect(await AssetModel.findOne({ id: '1' })).to.equal(null);
    });
  });
});
