const expect = require('chai').expect;
const Domainlist = require('../../../services/domainlist');
const SettingsService = require('../../../services/settings');

describe('services.Domainlist', () => {

  const domainlists = {
    whitelist: [
      'nytimes.com',
      'wapo.com'
    ]
  };

  let domainlist = new Domainlist();
  const settings = {id: '1', moderation: 'PRE', domainlist: {whitelist: ['nytimes.com', 'wapo.com']}};

  beforeEach(() => SettingsService.init(settings));

  describe('#init', () => {

    before(() => domainlist.upsert(domainlists));

    it('has entries', () => {
      expect(domainlist.lists.whitelist).to.not.be.empty;
    });

  });

  describe('#match', () => {

    const whiteList = Domainlist.parseList(domainlists['whitelist']);

    it('does match on an included domain', () => {
      [
        'wapo.com',
        'nytimes.com'
      ].forEach((domain) => {
        expect(domainlist.match(whiteList, domain)).to.be.true;
      });
    });

    it('does not match on a not included domain', () => {
      [
        'badsite.com',
        'www.badsite.com',
        'otherexample.com'
      ].forEach((domain) => {
        expect(domainlist.match(whiteList, domain)).to.be.false;
      });
    });
  });
});
