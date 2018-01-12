const { graphql } = require('graphql');

const schema = require('../../../../graph/schema');
const Context = require('../../../../graph/context');
const UserModel = require('../../../../models/user');
const SettingsService = require('../../../../services/settings');
const AssetModel = require('../../../../models/asset');

const { expect } = require('chai');

describe('graph.mutations.updateAssetSettings', () => {
  let asset;
  beforeEach(async () => {
    await SettingsService.init();
    asset = await AssetModel.create({ url: 'http://new.test.com/' });
  });

  const QUERY = `
  mutation UpdateAssetStatus($id: ID!, $settings: AssetSettingsInput!) {
    updateAssetSettings(id: $id, input: $settings) {
      errors {
        translation_key
      }
    }
  }`;

  describe('context with different user roles', () => {
    [
      { role: 'COMMENTER', error: 'NOT_AUTHORIZED' },
      { role: 'STAFF', error: 'NOT_AUTHORIZED' },
      { role: 'ADMIN' },
      { role: 'MODERATOR' },
    ].forEach(({ role, error }) => {
      it(`role = ${role}`, async () => {
        const user = new UserModel({ role });
        const ctx = new Context({ user });

        const settings = {
          premodLinksEnable: false,
          moderation: 'POST',
          questionBoxEnable: true,
          questionBoxContent: 'Question?',
          questionBoxIcon: '<Icon>',
        };

        const res = await graphql(schema, QUERY, {}, ctx, {
          id: asset.id,
          settings,
        });
        if (res.errors) {
          console.error(res.errors);
        }
        expect(res.errors).to.be.empty;

        if (error) {
          expect(res.data.updateAssetSettings.errors).to.not.be.empty;
          expect(res.data.updateAssetSettings.errors[0]).to.have.property(
            'translation_key',
            error
          );
        } else {
          if (
            res.data.updateAssetSettings &&
            res.data.updateAssetSettings.errors
          ) {
            console.error(res.data.updateAssetSettings.errors);
          }
          expect(res.data.updateAssetSettings).to.be.null;

          const retrievedAsset = await AssetModel.findOne({ id: asset.id });
          Object.keys(settings).forEach(key => {
            expect(retrievedAsset.settings).to.have.property(
              key,
              settings[key]
            );
          });
        }
      });
    });
  });
});
