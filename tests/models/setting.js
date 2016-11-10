/* eslint-env node, mocha */

require('../utils/mongoose');

const Setting = require('../../models/setting');
const expect = require('chai').expect;

describe('Setting: model', () => {

  beforeEach(() => {
    const defaults = {id: 1, moderation: 'pre'};
    return Setting.update({id: '1'}, {$setOnInsert: defaults}, {upsert: true});
  });

  describe('#getSettings()', () => {
    it('should have a moderation field defined', () => {
      return Setting.getSettings().then(settings => {
        expect(settings).to.have.property('moderation').and.to.equal('pre');
      });
    });
  });

  describe('#updateSettings()', () => {
    it('should update the settings with a passed object', () => {
      const mockSettings = {moderation: 'post'};
      return Setting.updateSettings(mockSettings).then(updatedSettings => {
        expect(updatedSettings).to.have.property('moderation').and.to.equal('post');
      });
    });
  });

  describe('#getModerationSetting', () => {
    it('should return the moderation settings', () => {
      return Setting.getModerationSetting().then(({moderation}) => {
        expect(moderation).not.to.be.null;
      });
    });
  });
});
