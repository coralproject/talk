const { graphql } = require('graphql');

const schema = require('../../../../graph/schema');
const Context = require('../../../../graph/context');
const SettingsService = require('../../../../services/settings');
const UserModel = require('../../../../models/user');
const UsersService = require('../../../../services/users');

const chai = require('chai');
chai.use(require('chai-datetime'));
const { expect } = chai;

describe('graph.queries.user', () => {
  let user;
  beforeEach(async () => {
    await SettingsService.init();

    user = await UsersService.createLocalUser(
      'usernameA@example.com',
      'password',
      'usernameA'
    );
  });

  describe('state', () => {
    const meQuery = `
      query Me {
        me {
          state {
            status {
              username {
                status
              }
            }
          }
        }
      }
    `;

    it('can query me', async () => {
      const ctx = new Context({ user });

      const { data, errors } = await graphql(schema, meQuery, {}, ctx);

      expect(errors).to.be.undefined;
      expect(data.me).to.not.be.null;
      expect(data.me.state).not.to.be.null;
      expect(data.me.state.status.username.status).to.be.equal('SET');
    });

    const query = `
      query User($user_id: ID!) {
        user(id: $user_id) {
          state {
            status {
              username {
                status
              }
            }
          }
        }
      }
    `;

    [
      { role: 'COMMENTER', can: false },
      { role: 'STAFF', can: false },
      { role: 'MODERATOR', can: true },
      { role: 'ADMIN', can: true },
    ].forEach(({ role, can }) => {
      it(`${can ? 'can' : 'can not'} query with role = ${role}`, async () => {
        const actor = new UserModel({ role });
        const ctx = new Context({ user: actor });

        const { data, errors } = await graphql(schema, query, {}, ctx, {
          user_id: user.id,
        });

        expect(errors).to.be.undefined;
        if (!can) {
          expect(data.user).to.be.null;
        } else {
          expect(data.user).to.not.be.null;
          expect(data.user.state).not.to.be.null;
          expect(data.user.state.status.username.status).to.be.equal('SET');
        }
      });
    });
  });
});
