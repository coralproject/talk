const { graphql } = require('graphql');

const schema = require('../../../../graph/schema');
const Context = require('../../../../graph/context');
const UserModel = require('../../../../models/user');
const SettingsService = require('../../../../services/settings');
const isEqual = require('lodash/isEqual');

const { expect } = require('chai');

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
  }`;

  describe('context with different user roles', () => {
    [
      { error: 'NOT_AUTHORIZED', role: 'COMMENTER' },
      { error: 'NOT_AUTHORIZED', role: 'MODERATOR' },
      { role: 'ADMIN' },
    ].forEach(({ role, error }) => {
      it(`role = ${role}`, async () => {
        const user = new UserModel({ role });
        const ctx = new Context({ user });

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
          expect(res.data.updateSettings.errors[0]).to.have.property(
            'translation_key',
            error
          );
        } else {
          if (res.data.updateSettings && res.data.updateSettings.errors) {
            console.error(res.data.updateSettings.errors);
          }
          expect(res.data.updateSettings).to.be.null;

          const retrievedSettings = await SettingsService.retrieve();
          Object.keys(newSettings).forEach(key => {
            expect(retrievedSettings).to.have.property(key, newSettings[key]);
          });
        }
      });
    });
  });

  describe('nested objects', () => {
    const user = new UserModel({ role: 'ADMIN' });
    const ctx = new Context({ user });

    it('should handle nested objects', async () => {
      const initSettings = {
        wordlist: {
          banned: ['fuck'],
          suspect: ['idiot', 'nazis'],
        },
        domains: {
          whitelist: ['localhost:3000'],
        },
      };

      let res = await graphql(schema, QUERY, {}, ctx, {
        settings: initSettings,
      });
      if (res.errors) {
        console.error(res.errors);
      }

      if (res.data.updateSettings && res.data.updateSettings.errors) {
        console.error(res.data.updateSettings.errors);
      }

      expect(res.errors).to.be.empty;
      expect(res.data.updateSettings).to.be.null;

      let retrievedSettings = await SettingsService.retrieve();
      Object.keys(initSettings).forEach(key => {
        Object.keys(initSettings[key]).forEach(nestedKey => {
          expect(retrievedSettings).to.have.property(key);
          expect(retrievedSettings[key]).to.have.property(nestedKey);
          expect(
            isEqual(
              retrievedSettings[key][nestedKey],
              initSettings[key][nestedKey]
            )
          ).to.be.true;
        });
      });

      const change = {
        wordlist: {
          suspect: ['idiot'],
        },
        domains: {
          whitelist: ['coralproject.org'],
        },
      };

      const changedSettings = Object.assign({}, initSettings, {
        wordlist: {
          suspect: change.wordlist.suspect,
        },
        domains: {
          whitelist: change.domains.whitelist,
        },
      });

      res = await graphql(schema, QUERY, {}, ctx, {
        settings: change,
      });

      if (res.errors) {
        console.error(res.errors);
      }

      if (res.data.updateSettings && res.data.updateSettings.errors) {
        console.error(res.data.updateSettings.errors);
      }

      expect(res.errors).to.be.empty;
      expect(res.data.updateSettings).to.be.null;

      retrievedSettings = await SettingsService.retrieve();
      Object.keys(changedSettings).forEach(key => {
        Object.keys(changedSettings[key]).forEach(nestedKey => {
          expect(retrievedSettings).to.have.property(key);
          expect(retrievedSettings[key]).to.have.property(nestedKey);
          expect(
            isEqual(
              retrievedSettings[key][nestedKey],
              changedSettings[key][nestedKey]
            )
          ).to.be.true;
        });
      });
    });
  });
});
