const passport = require('../../../passport');

const app = require('../../../../app');
const mailer = require('../../../../services/mailer');
const chai = require('chai');
const expect = chai.expect;

const Setting = require('../../../../models/setting');
const settings = {id: '1', moderation: 'pre', wordlist: {banned: ['bad words'], suspect: ['suspect words']}};

// Setup chai.
chai.should();
chai.use(require('chai-http'));

const User = require('../../../../models/user');

describe('/api/v1/users/:user_id/email/confirm', () => {

  let mockUser;

  beforeEach(() => Setting.init(settings)
  .then(() => User.createLocalUser('ana@gmail.com', '12345678', 'Ana'))
  .then((user) => {
    mockUser = user;
  }));

  describe('#post', () => {
    it('should send an email when we hit the endpoint', () => {
      expect(mailer.task.tasks).to.have.length(0);

      return chai.request(app)
        .post(`/api/v1/users/${mockUser.id}/email/confirm`)
        .set(passport.inject({roles: ['admin']}))
        .then((res) => {
          expect(res).to.have.status(204);
          expect(mailer.task.tasks).to.have.length(1);
        });
    });

    it('should send a 404 on not matching a user', () => {
      return chai.request(app)
        .post(`/api/v1/users/${mockUser.id}/email/confirm`)
        .set(passport.inject({roles: ['admin']}))
        .then((res) => {
          expect(res).to.have.status(204);
          expect(mailer.task.tasks).to.have.length(1);
        });
    });
  });
});

describe('/api/v1/users/:user_id/actions', () => {

  const users = [{
    displayName: 'Ana',
    email: 'ana@gmail.com',
    password: '123456789'
  }, {
    displayName: 'Maria',
    email: 'maria@gmail.com',
    password: '123456789'
  }];

  beforeEach(() => {
    return Setting.init(settings).then(() => {
      return User.createLocalUsers(users);
    });
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
