const chai = require('chai');
const expect = chai.expect;

const authz = require('../../../middleware/authorization');

describe('middleware.authorization', () => {
  describe('#has', () => {
    it('allows if no roles are specified', () => {
      expect(authz.has({ role: 'COMMENTER' })).to.be.true;
    });
    it('allows if the correct roles are met', () => {
      expect(authz.has({ role: 'ADMIN' }, 'ADMIN', 'MODERATOR')).to.be.true;
    });
    it('disallows if the role required is missing', () => {
      expect(authz.has({ role: 'COMMENTER' }, 'ADMIN', 'MODERATOR')).to.be
        .false;
    });
  });

  describe('#needed', () => {
    let needed = (...roles) => {
      let middleware = authz.needed(...roles);

      return middleware[middleware.length - 1];
    };

    it('allows if no roles are specified', () => {
      needed()({ user: { role: 'COMMENTER' } }, {}, err => {
        expect(err).to.be.undefined;
      });
    });
    it('allows if the correct roles are met', () => {
      needed()({ user: { role: 'ADMIN' } }, {}, err => {
        expect(err).to.be.undefined;
      });
    });
    it('disallows if the role required is missing', () => {
      needed('ADMIN', 'MODERATOR')({ user: { role: 'COMMENTER' } }, {}, err => {
        expect(err).to.not.be.undefined;
      });
    });
    it('disallows if there is no user on the request', () => {
      needed('ADMIN', 'MODERATOR')({}, {}, err => {
        expect(err).to.not.be.undefined;
      });
    });
  });
});
