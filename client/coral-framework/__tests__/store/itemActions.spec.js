import 'react';
import 'redux';
import {expect} from 'chai';
import fetchMock from 'fetch-mock';
import * as actions from '../../store/actions/items';
import {Map} from 'immutable';

import configureStore from 'redux-mock-store';

const mockStore = configureStore();

describe('itemActions', () => {
  let store;
  const host = 'http://test.host';

  beforeEach(() => {
    store = mockStore(new Map({}));
    fetchMock.restore();
  });

  describe('getItemsQuery', () => {
    const query = 'all';
    const rootId = '1234';
    const view = 'testView';
    const response = {results: [
      {Docs: [
        {type: 'comment', data: {content: 'stuff'}, item_id: '123'},
        {type: 'comment', data: {content: 'morestuff'}, item_id: '456'}
      ]}
    ]};

    it('should get an item from a query and send the appropriate dispatches', () => {
      fetchMock.get('*', JSON.stringify(response));
      return actions.getItemsQuery(query, rootId, view, host)(store.dispatch)
        .then((res) => {
          expect(fetchMock.calls().matched[0][0]).to.equal('http://test.host/v1/exec/all/view/testView/1234');
          expect(res).to.deep.equal(response.results[0].Docs);
          expect(store.getActions()[0]).to.deep.equal({
            type: actions.ADD_ITEM,
            item: response.results[0].Docs[0],
            item_id: '123'
          });
          expect(store.getActions()[1]).to.deep.equal({
            type: actions.ADD_ITEM,
            item: response.results[0].Docs[1],
            item_id: '456'
          });
        });
    });
    it('should handle an error', () => {
      fetchMock.get('*', 404);
      return actions.getItemsQuery(query, rootId, view, host)(store.dispatch)
        .catch((err) => {
          expect(err).to.be.truthy;
        });
    });
  });

  describe('getItemsArray', () => {
    const response = {items: [{type: 'comment', item_id: '123'}, {type: 'comment', item_id: '456'}]};
    const ids = [1, 2];

    it('should get an item from an array of ids and send the appropriate dispatches', () => {
      fetchMock.get('*', JSON.stringify(response));
      return actions.getItemsArray(ids, host)(store.dispatch)
        .then((res) => {
          expect(res).to.deep.equal(response.items);
          expect(store.getActions()[0]).to.deep.equal({
            type: actions.ADD_ITEM,
            item: {
              type: 'comment',
              item_id: '123'
            },
            item_id: '123'
          });
          expect(store.getActions()[1]).to.deep.equal({
            type: actions.ADD_ITEM,
            item: {
              type: 'comment', item_id: '456'
            },
            item_id: '456'
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
      type: 'comment',
      data:{content: 'stuff'}
    };

    it ('should post an item, return an id, then dispatch that item to the store', () => {
      fetchMock.post('*', {item_id: '123', type: 'comment', data: {content: 'stuff'}});
      return actions.postItem(item.data, item.type, undefined, host)(store.dispatch)
        .then((id) => {
          expect(fetchMock.calls().matched[0][1]).to.deep.equal(
            {
              method: 'POST',
              body: JSON.stringify({...item, version: 1})
            }
          );
          expect(id).to.equal('123');
          expect(store.getActions()[0]).to.deep.equal({
            type: actions.ADD_ITEM,
            item: {
              type: 'comment',
              data: {
                content: 'stuff'
              },
              item_id: '123'
            },
            item_id: '123'
          });
        });
    });
    it('should handle an error', () => {
      fetchMock.post('*', 404);
      return actions.postItem(item, host)(store.dispatch)
        .catch((err) => {
          expect(err).to.be.truthy;
        });
    });
  });

  describe('postAction', () => {
    it ('should post an action', () => {
      fetchMock.post('*', 200);
      return actions.postAction('abc', 'flag', '123', host)(store.dispatch)
        .then(response => {
          expect(fetchMock.calls().matched[0][0]).to.equal('http://test.host/v1/action/flag/user/123/on/item/abc');
          expect(response).to.equal('');
        });
    });

    it('should handle an error', () => {
      fetchMock.post('*', 404);
      return actions.postItem('abc', 'flag', '123', host)(store.dispatch)
        .catch((err) => {
          expect(err).to.be.truthy;
        });
    });

  });
});
