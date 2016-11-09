import {Map} from 'immutable';
import {expect} from 'chai';
import notificationReducer from '../../store/reducers/notification';
import * as actions from '../../store/actions/notification';

describe ('notificationsReducer', () => {
  describe('ADD_NOTIFICATION', () => {
    it('should add a notification', () => {
      const action = {
        type: actions.ADD_NOTIFICATION,
        text: 'Test notification',
        notifType: 'test'
      };
      const store = new Map({});
      const result = notificationReducer(store, action);
      expect(result.get('text')).to.equal(action.text);
      expect(result.get('type')).to.equal(action.notifType);
    });
  });

  describe('CLEAR_NOTIFICATION', () => {
    it('should clear a notification', () => {
      const action = {
        type: actions.CLEAR_NOTIFICATION
      };
      const store = new Map({
        text: 'Test notification',
        type: 'test'
      });
      const result = notificationReducer(store, action);
      expect(result.get('text')).to.equal(undefined);
      expect(result.get('type')).to.equal(undefined);
    });
  });
});
