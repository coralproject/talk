import 'react';
import 'redux';
import {expect} from 'chai';
import fetchMock from 'fetch-mock';
import * as actions from '../../../../client/coral-framework/store/actions/items';
import {Map} from 'immutable';

import configureStore from 'redux-mock-store';

const mockStore = configureStore();

describe('itemActions', () => {
  let store;

  beforeEach(() => {
    store = mockStore(new Map({}));
    fetchMock.restore();
  });

  describe('getStream', () => {
    const assetUrl = 'http://www.test.com';
    const response = {
      assets: [{
        id: '1234', url: assetUrl
      }],
      comments: [
        {body: 'stuff', id: '123'},
        {body: 'morestuff', id: '456'}
      ],
      actions: [
        {
          type: 'like',
          id: '123',
          count: 1,
          current_user: false
        },
        {
          type: 'flag',
          id: '456',
          count: 5,
          current_user: true
        }
      ]
    };

    it('should get an stream from an asset_id and send the appropriate dispatches', () => {
      fetchMock.get('*', JSON.stringify(response));
      return actions.getStream(assetUrl)(store.dispatch)
        .then((res) => {
          expect(fetchMock.calls().matched[0][0]).to.equal('/api/v1/stream?asset_url=http%3A%2F%2Fwww.test.com');
          expect(res).to.deep.equal(response);
          expect(store.getActions()[1]).to.deep.equal({
            type: actions.ADD_ITEM,
            item: response.comments[0],
            item_type: 'comments',
            id: '123'
          });
          expect(store.getActions()[2]).to.deep.equal({
            type: actions.ADD_ITEM,
            item: response.comments[1],
            item_type: 'comments',
            id: '456'
          });
        });
    });
    it('should handle an error', () => {
      fetchMock.get('*', 404);
      return actions.getStream(assetUrl)(store.dispatch)
        .catch((err) => {
          expect(err).to.be.truthy;
        });
    });
  });

  //Disabling tests for this function until is is used again.
  xdescribe('getItemsArray', () => {
    const response = {items: [{type: 'comment', id: '123'}, {type: 'comment', id: '456'}]};
    const ids = [1, 2];

    it('should get an item from an array of ids and send the appropriate dispatches', () => {
      fetchMock.get('*', JSON.stringify(response));
      return actions.getItemsArray(ids)(store.dispatch)
        .then((res) => {
          expect(res).to.deep.equal(response.items);
          expect(store.getActions()[0]).to.deep.equal({
            type: actions.ADD_ITEM,
            item: {
              type: 'comment',
              id: '123'
            },
            id: '123'
          });
          expect(store.getActions()[1]).to.deep.equal({
            type: actions.ADD_ITEM,
            item: {
              type: 'comment', id: '456'
            },
            id: '456'
          });
        });
    });
    it('should handle an error', () => {
      fetchMock.get('*', 404);
      return actions.getItemsArray(ids, host)(store.dispatch)
        .catch((err) => {
          expect(err).to.be.truthy;
        });
    });
  });

  describe('postItem', () => {
    const item = {
      type: 'comments',
      data: {body: 'stuff'}
    };

    it ('should post an item, return an id, then dispatch that item to the store', () => {
      fetchMock.post('*', {id: '123'});
      return actions.postItem(item.data, item.type, undefined)(store.dispatch)
        .then((id) => {
          expect(fetchMock.calls().matched[0][1]).to.deep.equal(
            {
              method: 'POST',
              headers: {
                'Content-Type':'application/json'
              },
              body: JSON.stringify(item.data)
            }
          );
          expect(id).to.equal('123');
          expect(store.getActions()[0]).to.deep.equal({
            type: actions.ADD_ITEM,
            item: {
              body: 'stuff',
              id: '123'
            },
            item_type: 'comments',
            id: '123'
          });
        });
    });
    it('should handle an error', () => {
      fetchMock.post('*', 404);
      return actions.postItem(item)(store.dispatch)
        .catch((err) => {
          expect(err).to.be.truthy;
        });
    });
  });

  describe('postAction', () => {
    it ('should post an action', () => {
      fetchMock.post('*', {id: '456'});
      return actions.postAction('abc', 'flag', '123', 'comments')(store.dispatch)
        .then(response => {
          expect(fetchMock.calls().matched[0][0]).to.equal('/api/v1/comments/abc/actions');
          expect(response).to.deep.equal({id:'456'});
        });
    });

    it('should handle an error', () => {
      fetchMock.post('*', 404);
      return actions.postAction('abc', 'flag', '123')(store.dispatch)
        .catch((err) => {
          expect(err).to.be.truthy;
        });
    });
  });

  describe('deleteAction', () => {
    it ('should remove an action', () => {
      fetchMock.delete('*', 'Action removed.');
      return actions.deleteAction('abc', 'flag', '123', 'comments')(store.dispatch)
        .then(response => {
          expect(fetchMock.calls().matched[0][0]).to.equal('/api/v1/comments/abc/actions');
          expect(response).to.equal('Action removed.');
        });
    });

    it('should handle an error', () => {
      fetchMock.post('*', 404);
      return actions.postAction('abc', 'flag', '123')(store.dispatch)
        .catch((err) => {
          expect(err).to.be.truthy;
        });
    });
  });
});
