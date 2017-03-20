import 'react';
import 'redux';
import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import * as actions from '../../../../client/coral-admin/src/actions/assets';
import { Map } from 'immutable';

import configureStore from 'redux-mock-store';

const mockStore = configureStore();

describe('Asset actions', () => {
  let store;

  const assets = [
    {
      url: 'http://test.com',
      id: '123',
      status: 'closed'
    },
    {
      url: 'http://test.org',
      id: '456',
      status: 'open'
    }
  ];

  beforeEach(() => {
    store = mockStore(new Map({}));
    fetchMock.restore();
  });

  describe('FETCH_ASSETS_REQUEST', () => {

    it('should fetch a list of assets', () => {

      fetchMock.get('*', JSON.stringify({
        result: assets,
        count: 2
      }));

      return actions.fetchAssets(2, 20)(store.dispatch)
        .then(() => {
          expect(store.getActions()[0]).to.have.property('type', 'FETCH_ASSETS_REQUEST');
          expect(store.getActions()[1]).to.have.property('type', 'FETCH_ASSETS_SUCCESS');
          expect(store.getActions()[1]).to.have.property('count', 2);
          expect(store.getActions()[1]).to.have.property('assets').
            and.to.deep.equal(assets);
        });
    });

    it('should return an error appropriatly', () => {

      fetchMock.get('*', 404);

      return actions.fetchAssets(2, 20)(store.dispatch)
        .then(() => {
          expect(store.getActions()[0]).to.have.property('type', 'FETCH_ASSETS_REQUEST');
          expect(store.getActions()[1]).to.have.property('type', 'FETCH_ASSETS_FAILURE');
        });
    });
  });

  describe('UPDATE_ASSET_STATE_REQUEST', () => {

    it('should update an asset', () => {

      fetchMock.put('*', JSON.stringify(assets[0]));

      return actions.updateAssetState('123', 'status', 'open')(store.dispatch)
        .then(() => {
          expect(store.getActions()[0]).to.have.property('type', 'UPDATE_ASSET_STATE_REQUEST');
          expect(store.getActions()[1]).to.have.property('type', 'UPDATE_ASSET_STATE_SUCCESS');
        });

    });

    it('should return an error appropriately', () => {

      fetchMock.put('*', 404);

      return actions.updateAssetState('123', 'status', 'open')(store.dispatch)
        .then(() => {
          expect(store.getActions()[0]).to.have.property('type', 'UPDATE_ASSET_STATE_REQUEST');
          expect(store.getActions()[1]).to.have.property('type', 'UPDATE_ASSET_STATE_FAILURE');
        });
    });
  });
});
