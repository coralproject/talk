const {graphql} = require('graphql');

const schema = require('../../../../graph/schema');
const Context = require('../../../../graph/context');
const UserModel = require('../../../../models/user');
const SettingsService = require('../../../../services/settings');

const {expect} = require('chai');

describe('graph.mutations.updateSettings', () => {
  beforeEach(async () => {
    await SettingsService.init();
  });

  const QUERY = `
  mutation UpdateSettings($settings: UpdateSettingsInput!) {
    updateSettings(input: $settings) {
      errors {
        translation_key
      }
    }
  }
`;

  describe('context with different user roles', () => {

    [
      {error: 'NOT_AUTHORIZED'},
      {error: 'NOT_AUTHORIZED', roles: []},
      {roles: ['ADMIN']},
      {roles: ['ADMIN', 'MODERATOR']},
      {roles: ['MODERATOR']},
    ].forEach(({roles, error}) => {
      it(roles ? roles.join(', ') : '<None>', async () => {
        let user;
        if (roles != null) {
          user = new UserModel({roles});
        }
        const ctx = new Context({user});

        const newSettings = {
          premodLinksEnable: false,
          moderation: 'POST',
          questionBoxEnable: true,
          questionBoxContent: 'Question?',
          questionBoxIcon: '<Icon>',
        };

        const res = await graphql(schema, QUERY, {}, ctx, {
          settings: newSettings,
        });
        if (res.errors) {
          console.error(res.errors);
        }
        expect(res.errors).to.be.empty;

        if (error) {
          expect(res.data.updateSettings.errors).to.not.be.empty;
          expect(res.data.updateSettings.errors[0]).to.have.property('translation_key', error);
        } else {
          if (res.data.updateSettings && res.data.updateSettings.errors) {
            console.error(res.data.updateSettings.errors);
          }
          expect(res.data.updateSettings).to.be.null;

          const retrievedSettings = await SettingsService.retrieve();
          Object.keys(newSettings).forEach((key) => {
            expect(retrievedSettings).to.have.property(key, newSettings[key]);
          });
        }
      });
    });
  });
});
