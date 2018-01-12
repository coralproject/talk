const { graphql } = require('graphql');

const schema = require('../../../../graph/schema');
const Context = require('../../../../graph/context');
const SettingsService = require('../../../../services/settings');
const UserModel = require('../../../../models/user');
const UsersService = require('../../../../services/users');
const mailer = require('../../../../services/mailer');

const sinon = require('sinon');
const chai = require('chai');
chai.use(require('sinon-chai'));
const { expect } = chai;

describe('graph.mutations.banUser', () => {
  let user;
  beforeEach(async () => {
    await SettingsService.init();

    user = await UsersService.createLocalUser(
      'usernameA@example.com',
      'password',
      'usernameA'
    );
  });

  let spy;
  before(() => {
    spy = sinon.spy(mailer, 'send');
  });

  afterEach(() => {
    spy.reset();
  });

  after(() => {
    spy.restore();
  });

  const banUserMutation = `
    mutation BanUser($user_id: ID!, $message: String!) {
      banUser(input: {
        id: $user_id,
        message: $message
      }) {
        errors {
          translation_key
        }
      }
    }

    mutation UnBanUser($user_id: ID!) {
      unbanUser(input: {
        id: $user_id
      }) {
        errors {
          translation_key
        }
      }
    }
  `;

  [
    { self: true, error: 'NOT_AUTHORIZED', role: 'COMMENTER' },
    { self: true, error: 'NOT_AUTHORIZED', role: 'STAFF' },
    { self: true, error: 'NOT_AUTHORIZED', role: 'COMMENTER' },
    { error: 'NOT_AUTHORIZED', role: 'COMMENTER' },
    { error: 'NOT_AUTHORIZED', role: 'STAFF' },
    { error: 'NOT_AUTHORIZED', role: 'COMMENTER' },
    { error: false, role: 'MODERATOR' },
    { error: false, role: 'ADMIN' },
  ].forEach(({ self, error, role }) => {
    it(`${error ? 'can not' : 'can'} ban ${
      self ? 'themself' : 'another user'
    } as a user with role=${role}`, async () => {
      const actor = new UserModel({ role });

      // If we're testing self assign, set the id of the actor to the user
      // we're acting on.
      if (self) {
        actor.id = user.id;
      }

      const ctx = new Context({ user: actor });

      const { data, errors } = await graphql(
        schema,
        banUserMutation,
        {},
        ctx,
        {
          user_id: user.id,
          message: 'This is a message',
        },
        'BanUser'
      );

      if (errors && errors.length > 0) {
        console.error(errors);
      }
      expect(errors).to.be.undefined;
      if (error) {
        expect(data.banUser).to.have.property('errors').not.null;
        expect(data.banUser.errors[0]).to.have.property(
          'translation_key',
          error
        );
      } else {
        expect(data.banUser).to.be.null;

        user = await UserModel.findOne({ id: user.id });

        expect(user.status.banned.status).to.be.true;
        expect(user.status.banned.history).to.have.length(1);
        expect(user.status.banned.history[0]).to.have.property('status', true);
        expect(user.status.banned.history[0]).to.have.property(
          'message',
          'This is a message'
        );
        expect(user.status.banned.history[0]).to.have.property(
          'assigned_by',
          actor.id
        );
        expect(user.status.banned.history[0]).to.have.property('created_at').not
          .null;

        expect(user.banned).to.be.true;

        expect(spy).to.have.been.calledOnce;

        const res = await graphql(
          schema,
          banUserMutation,
          {},
          ctx,
          {
            user_id: user.id,
          },
          'UnBanUser'
        );
        if (res.errors && res.errors.length > 0) {
          console.error(res.errors);
        }
        expect(res.errors).to.be.undefined;
        expect(res.data.unbanUser).to.be.null;

        user = await UserModel.findOne({ id: user.id });

        expect(user.status.banned.status).to.be.false;
        expect(user.status.banned.history).to.have.length(2);
        expect(user.status.banned.history[0]).to.have.property('status').to.be
          .true;
        expect(user.status.banned.history[0]).to.have.property(
          'assigned_by',
          actor.id
        );
        expect(user.status.banned.history[0]).to.have.property('created_at').not
          .null;
        expect(user.status.banned.history[1]).to.have.property('status').to.be
          .false;
        expect(user.status.banned.history[1]).to.have.property(
          'assigned_by',
          actor.id
        );
        expect(user.status.banned.history[1]).to.have.property('created_at').not
          .null;

        expect(user.banned).to.be.false;
      }
    });
  });
});
