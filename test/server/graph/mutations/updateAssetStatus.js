const { graphql } = require('graphql');

const schema = require('../../../../graph/schema');
const Context = require('../../../../graph/context');
const UserModel = require('../../../../models/user');
const SettingsService = require('../../../../services/settings');
const AssetModel = require('../../../../models/asset');

const { expect } = require('chai');

describe('graph.mutations.updateAssetStatus', () => {
  let asset;
  beforeEach(async () => {
    await SettingsService.init();
    asset = await AssetModel.create({ url: 'http://new.test.com/' });
  });

  const QUERY = `
    mutation UpdateAssetStatus($id: ID!, $status: UpdateAssetStatusInput!) {
      updateAssetStatus(id: $id, input: $status) {
        errors {
          translation_key
        }
      }
    }
  `;

  describe('context with different user roles', () => {
    [
      { role: 'COMMENTER', error: 'NOT_AUTHORIZED' },
      { role: 'ADMIN' },
      { role: 'MODERATOR' },
    ].forEach(({ role, error }) => {
      it(`role = ${role}`, async () => {
        const user = new UserModel({ role });
        const ctx = new Context({ user });

        const closedAt = new Date().toISOString();
        const closedMessage = 'my closed message!';

        const res = await graphql(schema, QUERY, {}, ctx, {
          id: asset.id,
          status: {
            closedAt,
            closedMessage,
          },
        });
        if (res.errors) {
          console.error(res.errors);
        }
        expect(res.errors).to.be.empty;

        if (error) {
          expect(res.data.updateAssetStatus.errors).to.not.be.empty;
          expect(res.data.updateAssetStatus.errors[0]).to.have.property(
            'translation_key',
            error
          );
        } else {
          if (res.data.updateAssetStatus && res.data.updateAssetStatus.errors) {
            console.error(res.data.updateAssetStatus.errors);
          }
          expect(res.data.updateAssetStatus).to.be.null;

          const retrievedAsset = await AssetModel.findOne({ id: asset.id });
          expect(retrievedAsset.closedAt).to.not.be.null;
          expect(retrievedAsset).to.have.property(
            'closedMessage',
            closedMessage
          );
        }
      });
    });
  });
});
