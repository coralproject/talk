const User = require('../../../models/user');
const Context = require('../../../graph/context');
const { ErrNotAuthorized } = require('../../../errors');
const SettingsService = require('../../../services/settings');

const { expect } = require('chai');

describe('graph.Context', () => {
  beforeEach(() => SettingsService.init());

  describe('#constructor: with a user', () => {
    let c;

    beforeEach(() => {
      c = new Context({ user: new User({ id: '1', role: 'ADMIN' }) });
    });

    it('creates a context with a user', done => {
      expect(c).to.have.property('user');
      expect(c.user).to.have.property('id', '1');

      done();
    });

    it('does have access to mutators', () => {
      return c.mutators.Tag.add({
        item_type: 'USERS',
        id: '1',
        name: 'Tag',
      });
    });
  });

  describe('#rootParent', () => {
    it('can access the root context parent', () => {
      const ctx = new Context({ test: 1 });
      const ctx2 = new Context(ctx);
      const ctx3 = new Context(ctx2);

      const parent = ctx3.rootParent;

      expect(parent).to.have.property('test', 1);
    });
  });

  describe('#constructor: without a user', () => {
    let c;

    beforeEach(() => {
      c = new Context({ user: undefined });
    });

    it('creates a context without a user', done => {
      expect(c.user).to.be.falsy;

      done();
    });

    it('does not have access to mutators', () => {
      return c.mutators.Tag.add({
        item_type: 'COMMENTS',
        id: '1',
        name: 'Tag',
      })
        .then(() => {
          throw new Error('should not reach this point');
        })
        .catch(err => {
          expect(err).to.be.an.instanceof(ErrNotAuthorized);
        });
    });
  });
});
