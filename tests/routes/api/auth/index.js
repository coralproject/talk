const app = require('../../../../app');
const chai = require('chai');
const expect = chai.expect;

chai.use(require('chai-http'));

const agent = chai.request.agent(app);

const User = require('../../../../models/user');

describe('/api/v1/auth', () => {
  describe('#get', () => {
    it('should return nothing when no user is logged in', () => {
      return chai.request(app)
        .get('/api/v1/auth')
        .then((res) => {
          expect(res.status).to.be.equal(200);
          expect(res.body).to.have.property('csrfToken');
        });
    });
  });
});

describe('/api/v1/auth/local', () => {

  beforeEach(() => {
    return User.createLocalUser('maria@gmail.com', 'password!', 'Maria');
  });

  describe('#post', () => {
    it('should send back the user on a successful login', () => {

      agent
        .get('/api/v1/auth')
        .then((res) => {
          expect(res.status).to.be.equal(200);
          expect(res.body).to.have.property('csrfToken');
          return agent.post('/api/v1/auth/local')
            .send({email: 'maria@gmail.com', password: 'password!', csrfToken: res.body.csrfToken})
            .catch((res2) => {
              expect(res2).to.have.status(200);
              expect(res2).to.be.json;
              expect(res2.body).to.have.property('user');
              expect(res2.body.user).to.have.property('displayName', 'Maria');
            });
        });
    });

    it('should not send back the user on a unsuccessful login', () => {
      return chai.request(app)
        .post('/api/v1/auth/local')
        .send({email: 'maria@gmail.com', password: 'password!3'})
        .catch((err) => {
          expect(err).to.not.be.null;
          expect(err.response).to.have.status(401);
          expect(err.response.body).to.have.property('message', 'not authorized');
        });
    });
  });
});
