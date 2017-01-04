const passport = require('../../../passport');

const app = require('../../../../app');
const chai = require('chai');
const expect = chai.expect;

const agent = chai.request.agent(app);

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
      agent
      .get('/api/v1/auth')
        .then((resa) => {
          expect(resa.status).to.be.equal(200);
          expect(resa.body).to.have.property('csrfToken');
          return agent.post('/api/v1/users/abc/actions')
            .set(passport.inject({id: '456', roles: ['admin']}))
            .send({'action_type': 'flag', 'detail': 'Bio is too awesome.', _csrf: resa.csrfToken})
            .then((res) => {
              expect(res).to.have.status(201);
              expect(res).to.have.body;
              expect(res.body).to.have.property('action_type', 'flag');
              expect(res.body).to.have.property('metadata')
                .and.to.deep.equal({'reason': 'Bio is too awesome.'});
              expect(res.body).to.have.property('item_id', 'abc');
            })
            .catch(err => console.error(err.message));
        });
    });
  });
});
