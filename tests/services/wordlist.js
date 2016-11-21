const expect = require('chai').expect;

const wordlist = require('../../services/wordlist');

describe.only('wordlist: services', () => {

  before(() => wordlist.insert([
    'BAD',
    'bad',
    'how to murder',
    'how to kill'
  ]));

  beforeEach(() => {
    expect(wordlist.list).to.not.be.empty;
    expect(wordlist.enabled).to.be.true;
  });

  describe('#init', () => {

    it('has entries', () => {
      expect(wordlist.list).to.not.be.empty;
      expect(wordlist.enabled).to.be.true;
    });

  });

  describe('#match', () => {

    it('does match on a bad word', () => {
      [
        'how to kill',
        'what is bad',
        'bad',
        'BAD.',
        'how to murder',
        'How To mUrDer'
      ].forEach((word) => {
        expect(wordlist.match(word)).to.be.true;
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
        expect(wordlist.match(word)).to.be.false;
      });
    });

  });

  describe('#filter', () => {

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
        expect(req.wordlist.matched).to.be.equal(wordlist.ErrContainsProfanity);

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
