const expect = require('chai').expect;

const Wordlist = require('../../services/wordlist');

describe('wordlist: services', () => {

  const wordlists = {
    banned: [
      'BAD',
      'bad',
      'how to murder',
      'how to kill'
    ],
    suspect: [
      'murder'
    ]
  };

  let wordlist = new Wordlist();

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
        'how to kill',
        'what is bad',
        'bad',
        'BAD.',
        'how to murder',
        'How To mUrDer'
      ].forEach((word) => {
        expect(wordlist.match(bannedList, word)).to.be.true;
      });
    });

    it('does not match on a good word', () => {
      [
        'how to',
        'kill',
        'bads',
        'how to be a great person?',
        'how to not kill?'
      ].forEach((word) => {
        expect(wordlist.match(bannedList, word)).to.be.false;
      });
    });

  });

  describe('#filter', () => {

    before(() => wordlist.upsert(wordlists));

    it('matches on bodies containing bad words', (done) => {

      let req = {
        body: {
          content: 'how to kill?'
        }
      };

      wordlist.filter('content')(req, {}, (err) => {
        expect(err).to.be.undefined;
        expect(req).to.have.property('wordlist');
        expect(req.wordlist).to.have.property('matched');
        expect(req.wordlist.banned).to.be.equal(Wordlist.ErrContainsProfanity);

        done();
      });

    });

    it('does not match on bodies not containing bad words', (done) => {

      let req = {
        body: {
          content: 'how to be a great person?'
        }
      };

      wordlist.filter('content')(req, {}, (err) => {
        expect(err).to.be.undefined;
        expect(req).to.have.property('wordlist');
        expect(req.wordlist).to.have.property('matched');
        expect(req.wordlist.matched).to.be.false;

        done();
      });

    });

    it('does not match on bodies not containing the bad word field', (done) => {

      let req = {
        body: {
          author: 'how to kill?',
          content: 'how to be a great person?'
        }
      };

      wordlist.filter('content')(req, {}, (err) => {
        expect(err).to.be.undefined;
        expect(req).to.have.property('wordlist');
        expect(req.wordlist).to.have.property('matched');
        expect(req.wordlist.matched).to.be.false;

        done();
      });

    });

  });

});
