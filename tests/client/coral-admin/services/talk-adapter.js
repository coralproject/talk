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

  beforeEach(() => {
    store = mockStore(new Map({}));
    fetchMock.restore();
  });

  describe('ASSETS_FETCH', () => {

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

    it('should fetch a list of assets', () => {

      const action = {
        type: 'ASSETS_FETCH',
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
          expect(store.getActions()[0]).to.have.property('type', 'ASSETS_FETCH_SUCCESS');
          expect(store.getActions()[0]).to.have.property('count', 2);
          expect(store.getActions()[0]).to.have.property('assets').
            and.to.deep.equal(assets);
        });
    });

    it('should return an error appropriatly', () => {

      const action = {
        type: 'ASSETS_FETCH',
        skip: 2,
        limit: 20,
        search: ''
      };

      fetchMock.get('*', 404);

      return adapter(store)(()=>{})(action)
        .then(() => {
          expect(store.getActions()[0]).to.have.property('type', 'ASSETS_FETCH_FAILED');
        });
    });
  });
});
