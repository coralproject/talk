const expect = require('chai').expect;

const User = require('../../../models/user');
const Context = require('../../../graph/context');
const errors = require('../../../errors');

describe('graph.Context', () => {

  describe('#constructor: with a user', () => {
    let c;

    beforeEach(() => {
      c = new Context({user: new User({id: '1'})});
    });

    it('creates a context with a user', (done) => {
      expect(c).to.have.property('user');
      expect(c.user).to.have.property('id', '1');

      done();
    });

    it('does have access to mutators', () => {
      return c.mutators.Action.create({
        item_id: '1',
        item_type: 'COMMENTS',
        action_type: 'LIKE'
      })
      .then((action) => {
        expect(action).to.have.property('item_id', '1');
        expect(action).to.have.property('item_type', 'COMMENTS');
        expect(action).to.have.property('action_type', 'LIKE');
      });
    });
  });

  describe('#constructor: without a user', () => {
    let c;

    beforeEach(() => {
      c = new Context({user: undefined});
    });

    it('creates a context without a user', (done) => {
      expect(c).to.not.have.property('user');

      done();
    });

    it('does not have access to mutators', () => {
      return c.mutators.Action.create({
        item_id: '1',
        item_type: 'COMMENTS',
        action_type: 'LIKE'
      })
      .then((action) => {
        expect(action).to.be.null;
      })
      .catch((err) => {
        expect(err).to.be.equal(errors.ErrNotAuthorized);
      });
    });
  });
});
