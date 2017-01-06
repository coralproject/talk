const passport = require('../../../passport');

const app = require('../../../../app');
const chai = require('chai');
const expect = chai.expect;

// Setup chai.
chai.should();
chai.use(require('chai-http'));

const User = require('../../../../models/user');

describe('/api/v1/users/:user_id/actions', () => {

  const users = [{
    displayName: 'Ana',
    email: 'ana@gmail.com',
    password: '123'
  }, {
    displayName: 'Maria',
    email: 'maria@gmail.com',
    password: '123'
  }];

  beforeEach(() => {
    return User.createLocalUsers(users);
  });

  describe('#post', () => {
    it('it should update actions', () => {
      return chai.request(app)
        .post('/api/v1/users/abc/actions')
        .set(passport.inject({id: '456', roles: ['admin']}))
        .send({'action_type': 'flag', metadata: {reason: 'Bio is too awesome.'}})
        .then((res) => {
          expect(res).to.have.status(201);
          expect(res).to.have.body;
          expect(res.body).to.have.property('action_type', 'flag');
          expect(res.body).to.have.property('metadata')
            .and.to.deep.equal({'reason': 'Bio is too awesome.'});
          expect(res.body).to.have.property('item_id', 'abc');
        });
    });
  });
});
