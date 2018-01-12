const SettingsService = require('../../../services/settings');
const chai = require('chai');
const expect = chai.expect;

describe('services.SettingsService', () => {
  beforeEach(() =>
    SettingsService.init({ moderation: 'PRE', wordlist: ['donut'] })
  );

  describe('#retrieve()', () => {
    it('should have a moderation field defined', () => {
      return SettingsService.retrieve().then(settings => {
        expect(settings)
          .to.have.property('moderation')
          .and.to.equal('PRE');
      });
    });

    it('should have two infoBox fields defined', () => {
      return SettingsService.retrieve().then(settings => {
        expect(settings)
          .to.have.property('infoBoxEnable')
          .and.to.equal(false);
        expect(settings)
          .to.have.property('infoBoxContent')
          .and.to.equal('');
      });
    });
  });

  describe('#update()', () => {
    it('should update the settings with a passed object', () => {
      const mockSettings = {
        moderation: 'POST',
        infoBoxEnable: true,
        infoBoxContent: 'yeah',
      };
      return SettingsService.update(mockSettings).then(updatedSettings => {
        expect(updatedSettings).to.be.an('object');
        expect(updatedSettings)
          .to.have.property('moderation')
          .and.to.equal('POST');
        expect(updatedSettings).to.have.property('infoBoxEnable', true);
        expect(updatedSettings).to.have.property('infoBoxContent', 'yeah');
      });
    });

    it('should be ok when receiving an object based off of a mongoose model', async () => {
      const mockSettings = {
        moderation: 'POST',
        infoBoxEnable: true,
        infoBoxContent: 'yeah',
      };
      await SettingsService.update(mockSettings);

      const settings = await SettingsService.retrieve();
      settings.charCount = 500;

      await SettingsService.update(settings.toObject());
    });
  });

  describe('#get', () => {
    it('should return the moderation settings', () => {
      return SettingsService.retrieve().then(({ moderation }) => {
        expect(moderation).not.to.be.null;
      });
    });
  });

  describe('#merge', () => {
    it('should merge a settings object and its overrides', () => {
      return SettingsService.retrieve().then(settings => {
        let ovrSett = { moderation: 'POST' };

        settings.merge(ovrSett);

        expect(settings).to.have.property('moderation', 'POST');
      });
    });
  });
});
