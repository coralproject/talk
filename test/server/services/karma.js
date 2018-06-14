const chai = require('chai');
const { expect } = chai;
const { merge } = require('lodash');
const Karma = require('../../../services/karma');

const thresholdsBackup = {};
const thresholdsOverride = {
  comment: {
    RELIABLE: 2,
    UNRELIABLE: 0,
  },
  flag: {
    RELIABLE: 1,
    UNRELIABLE: -1,
  },
};

describe('services.Karma', () => {
  before(() => {
    // Backup the existing thresholds.
    merge(thresholdsBackup, Karma.THRESHOLDS);

    // Configure the thresholds to a known value.
    merge(Karma.THRESHOLDS, thresholdsOverride);

    expect(Karma.THRESHOLDS).to.deep.equal(thresholdsOverride);
  });

  after(() => {
    // Restore the thresholds.
    merge(Karma.THRESHOLDS, thresholdsBackup);

    expect(Karma.THRESHOLDS).to.deep.equal(thresholdsBackup);
  });

  describe('#isReliable', () => {
    it('neutral', () => {
      expect(Karma.isReliable('comment', { comment: { karma: 1 } })).to.be.null;
      expect(Karma.isReliable('comment', { comment: { karma: 0 } })).to.not.be
        .null;
      expect(Karma.isReliable('comment', { comment: { karma: -1 } })).to.not.be
        .null;
    });
    it('unreliable', () => {
      expect(Karma.isReliable('comment', {})).to.be.false;
      expect(Karma.isReliable('comment', { comment: {} })).to.be.false;
      expect(Karma.isReliable('comment', { comment: { karma: 0 } })).to.be
        .false;
    });
    it('reliable', () => {
      expect(Karma.isReliable('comment', { comment: { karma: 2 } })).to.be.true;
      expect(Karma.isReliable('comment', { comment: { karma: 3 } })).to.be.true;
    });
  });
});
