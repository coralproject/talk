import 'react';
import 'redux';
import {expect} from 'chai';
import fetchMock from 'fetch-mock';
import adapter from '../../../../client/coral-admin/src/services/talk-adapter';
import {Map} from 'immutable';

import configureStore from 'redux-mock-store';

const mockStore = configureStore();

describe('talk-adapter.js', () => {
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

  describe('FETCH_ASSETS', () => {

    it('should fetch a list of assets', () => {

      const action = {
        type: 'FETCH_ASSETS',
        skip: 2,
        limit: 20,
        search: ''
      };

      fetchMock.get('*', JSON.stringify({
        result: assets,
        count: 2
      }));

      return adapter(store)(()=>{})(action)
        .then(() => {
          expect(store.getActions()[0]).to.have.property('type', 'FETCH_ASSETS_SUCCESS');
          expect(store.getActions()[0]).to.have.property('count', 2);
          expect(store.getActions()[0]).to.have.property('assets').
            and.to.deep.equal(assets);
        });
    });

    it('should return an error appropriatly', () => {

      const action = {
        type: 'FETCH_ASSETS',
        skip: 2,
        limit: 20,
        search: ''
      };

      fetchMock.get('*', 404);

      return adapter(store)(()=>{})(action)
        .then(() => {
          expect(store.getActions()[0]).to.have.property('type', 'FETCH_ASSETS_FAILED');
        });
    });
  });

  describe('UPDATE_ASSET_STATE', () => {

    it('should update an asset', () => {
      const action = {
        type: 'UPDATE_ASSET_STATE',
        id: '123',
        property: 'closedAt',
        value: Date.now()
      };

      fetchMock.put('*', JSON.stringify(assets[0]));

      return adapter(store)(()=>{})(action)
        .then(() => {
          expect(store.getActions()[0]).to.have.property('type', 'UPDATE_ASSET_STATE_SUCCESS');
        });

    });

    it('should return an error appropriately', () => {

      const action = {
        type: 'UPDATE_ASSET_STATE',
        id: '123',
        property: 'closedAt',
        value: Date.now()
      };

      fetchMock.put('*', 404);

      return adapter(store)(()=>{})(action)
        .then(() => {
          expect(store.getActions()[0]).to.have.property('type', 'UPDATE_ASSET_STATE_FAILED');
        });
    });
  });
});
