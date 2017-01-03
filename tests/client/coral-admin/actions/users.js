import 'react';
import 'redux';
import {expect} from 'chai';
import fetchMock from 'fetch-mock';
import * as userActions from '../../../../client/coral-admin/src/actions/users';
import {Map} from 'immutable';

import configureStore from 'redux-mock-store';

const mockStore = configureStore();

describe('User actions', () => {
  let store;

  const users = [
    {
      id: '123',
      status: 'suspended'
    },
    {
      id: '456',
      status: 'active'
    }
  ];

  const actions = [
    {
      itemType: 'user',
      itemId: '123'
    }
  ];

  beforeEach(() => {
    store = mockStore(new Map({}));
    fetchMock.restore();
  });

  describe('fetchModerationQueueUsers', () => {

    it('should fetch users and actions pending moderation', () => {

      fetchMock.get('*', JSON.stringify({
        users,
        actions
      }));

      return userActions.fetchModerationQueueUsers()(store.dispatch)
        .then(() => {
          console.log(store.getActions());
          expect(store.getActions()[0]).to.have.property('type', 'USERS_MODERATION_QUEUE_FETCH_REQUEST');
          expect(store.getActions()[1]).to.have.property('type', 'USERS_MODERATION_QUEUE_FETCH_SUCCESS');
          expect(store.getActions()[1]).to.have.property('users').
            and.to.deep.equal(users);
          expect(store.getActions()[2]).to.have.property('type', 'ACTIONS_MODERATION_QUEUE_FETCH_SUCCESS');
          expect(store.getActions()[2]).to.have.property('actions').
            and.to.deep.equal(actions);
        });
    });

    it('should return an error appropriatly', () => {

      fetchMock.get('*', 404);

      return userActions.fetchModerationQueueUsers()(store.dispatch)
        .then(() => {
          expect(store.getActions()[0]).to.have.property('type', 'USERS_MODERATION_QUEUE_FETCH_REQUEST');
          expect(store.getActions()[1]).to.have.property('type', 'USERS_MODERATION_QUEUE_FETCH_FAILURE');
        });
    });
  });

});
