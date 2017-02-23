import {Map} from 'immutable';
import {expect} from 'chai';
import assetReducer from '../../../../client/coral-framework/reducers/asset';
import * as actions from '../../../../client/coral-framework/constants/asset';

describe ('coral-embed-stream assetReducer', () => {
  describe('UPDATE_COUNT_CACHE', () => {
    it('should update the count cache', () => {
      const action = {
        type: actions.UPDATE_COUNT_CACHE,
        id: '123',
        count: 456
      };
      const store = new Map({});
      const result = assetReducer(store, action);
      expect(result.getIn(['countCache', '123'])).to.equal(456);
    });
  });
});
