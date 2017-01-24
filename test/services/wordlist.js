const expect = require('chai').expect;
const Errors = require('../../errors');
const Wordlist = require('../../services/wordlist');
const SettingsService = require('../../services/settings');

describe('services.Wordlist', () => {

  const wordlists = {
    banned: [
      'cookies',
      'how to do bad things',
      'how to do really bad things'
    ],
    suspect: [
      'do bad things'
    ]
  };

  let wordlist = new Wordlist();
  const settings = {id: '1', moderation: 'PRE', wordlist: {banned: ['bad words'], suspect: ['suspect words']}};

  beforeEach(() => SettingsService.init(settings));

  describe('#init', () => {

    before(() => wordlist.upsert(wordlists));

    it('has entries', () => {
      expect(wordlist.lists.banned).to.not.be.empty;
      expect(wordlist.lists.suspect).to.not.be.empty;
    });

  });

  describe('#match', () => {

    const bannedList = Wordlist.parseList(wordlists.banned);

    it('does match on a bad word', () => {
      [
        'how to do really bad things',
        'what is cookies',
        'cookies',
        'COOKIES.',
        'how to do bad things',
        'How To do bad things!'
      ].forEach((word) => {
        expect(wordlist.match(bannedList, word)).to.be.true;
      });
    });

    it('does not match on a good word', () => {
      [
        'how to',
        'cookie',
        'how to be a great person?',
        'how to not do really bad things?'
      ].forEach((word) => {
        expect(wordlist.match(bannedList, word)).to.be.false;
      });
    });

  });

  describe('#filter', () => {

    before(() => wordlist.upsert(wordlists));

    it('matches on bodies containing bad words', () => {
      let errors = wordlist.filter({
        content: 'how to do really bad things?'
      }, 'content');

      expect(errors).to.have.property('banned', Errors.ErrContainsProfanity);
    });

    it('does not match on bodies not containing bad words', () => {
      let errors = wordlist.filter({
        content: 'how to not do really bad things?'
      }, 'content');

      expect(errors).to.not.have.property('banned');
    });

    it('does not match on bodies not containing the bad word field', () => {
      let errors = wordlist.filter({
        author: 'how to do really bad things?',
        content: 'how to be a great person?'
      }, 'content');

      expect(errors).to.not.have.property('banned');
    });

  });

});
