const Setting = require('../../models/setting');
const expect = require('chai').expect;

describe('models.Setting', () => {

  beforeEach(() => Setting.init({moderation: 'pre', wordlist: ['donut']}));

  describe('#retrieve()', () => {
    it('should have a moderation field defined', () => {
      return Setting.retrieve().then(settings => {
        expect(settings).to.have.property('moderation').and.to.equal('pre');
      });
    });

    it('should have two infoBox fields defined', () => {
      return Setting.retrieve().then(settings => {
        expect(settings).to.have.property('infoBoxEnable').and.to.equal(false);
        expect(settings).to.have.property('infoBoxContent').and.to.equal('');
      });
    });
  });

  describe('#public()', () => {
    it('should have a moderation field defined', () => {
      return Setting.public().then(settings => {
        expect(settings).to.have.property('moderation').and.to.equal('pre');
      });
    });

    it('should not have the wordlist field defined', () => {
      return Setting.public().then(settings => {
        expect(settings).to.have.property('wordlist').and.to.have.length(0);
      });
    });
  });

  describe('#update()', () => {
    it('should update the settings with a passed object', () => {
      const mockSettings = {moderation: 'post', infoBoxEnable: true, infoBoxContent: 'yeah'};
      return Setting.update(mockSettings).then(updatedSettings => {
        expect(updatedSettings).to.be.an('object');
        expect(updatedSettings).to.have.property('moderation').and.to.equal('post');
        expect(updatedSettings).to.have.property('infoBoxEnable', true);
        expect(updatedSettings).to.have.property('infoBoxContent', 'yeah');
      });
    });
  });

  describe('#get', () => {
    it('should return the moderation settings', () => {
      return Setting.retrieve().then(({moderation}) => {
        expect(moderation).not.to.be.null;
      });
    });
  });

  describe('#merge', () => {
    it('should merge a settings object and its overrides', () => {
      return Setting
        .retrieve()
        .then((settings) => {
          let ovrSett = {moderation: 'post'};

          settings.merge(ovrSett);

          expect(settings).to.have.property('moderation', 'post');
        });
    });
  });
});
