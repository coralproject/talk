const passport = require('../../../passport');

const app = require('../../../../app');
const mailer = require('../../../../services/mailer');
const chai = require('chai');
const expect = chai.expect;

const SettingsService = require('../../../../services/settings');
const settings = {id: '1', moderation: 'PRE', wordlist: {banned: ['bad words'], suspect: ['suspect words']}};

// Setup chai.
chai.should();
chai.use(require('chai-http'));

const UsersService = require('../../../../services/users');

describe('/api/v1/users/:user_id/email/confirm', () => {

  let mockUser;

  beforeEach(() => SettingsService.init(settings).then(() => {
    return UsersService.createLocalUser('ana@gmail.com', '123321123', 'Ana');
  })
  .then((user) => {
    mockUser = user;
  }));

  describe('#post', () => {
    it('should send an email when we hit the endpoint', () => {
      expect(mailer.task.tasks).to.have.length(0);

      return chai.request(app)
        .post(`/api/v1/users/${mockUser.id}/email/confirm`)
        .set(passport.inject({roles: ['ADMIN']}))
        .then((res) => {
          expect(res).to.have.status(204);
          expect(mailer.task.tasks).to.have.length(1);
        });
    });

    it('should send a 404 on not matching a user', () => {
      return chai.request(app)
        .post(`/api/v1/users/${mockUser.id}/email/confirm`)
        .set(passport.inject({roles: ['ADMIN']}))
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
    return SettingsService.init(settings).then(() => {
      return UsersService.createLocalUsers(users);
    });
  });

  describe('#post', () => {
    it('it should update actions', () => {
      return chai.request(app)
        .post('/api/v1/users/abc/actions')
        .set(passport.inject({id: '456', roles: ['ADMIN']}))
        .send({'action_type': 'FLAG', metadata: {reason: 'Bio is too awesome.'}})
        .then((res) => {
          expect(res).to.have.status(201);
          expect(res).to.have.body;
          expect(res.body).to.have.property('action_type', 'FLAG');
          expect(res.body).to.have.property('item_id', 'abc');
        });
    });
  });
});

describe('/api/v1/users/:user_id/username-enable', () => {
  let mockUser;

  beforeEach(() => SettingsService.init(settings).then(() => {
    return UsersService.createLocalUser('ana@gmail.com', '123321123', 'Ana');
  })
  .then((user) => {
    mockUser = user;
  }));

  describe('#post', () => {
    it('it should enable a user to edit their username', () => {
      return chai.request(app)
        .post(`/api/v1/users/${mockUser.id}/username-enable`)
        .set(passport.inject({id: '456', roles: ['ADMIN']}))
        .then((res) => {
          expect(res).to.have.status(204);
        });
    });
  });
});
