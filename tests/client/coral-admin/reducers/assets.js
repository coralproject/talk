import {Map} from 'immutable';
import {expect} from 'chai';
import assetsReducer from '../../../../client/coral-admin/src/reducers/assets';

describe ('assetsReducer', () => {
  describe('FETCH_ASSETS_SUCCESS', () => {
    it('should replace the existing assets', () => {
      const action = {
        type: 'FETCH_ASSETS_SUCCESS',
        count: 200,
        assets: [
          {
            id: '123',
            url: 'http://test.com',
            closedAt: 'tomorrow'
          },
          {
            id: '456',
            url: 'http://test2.com',
            closedAt: 'thursday'
          },
        ]
      };
      const store = new Map({});
      const result = assetsReducer(store, action);
      console.log(result.getIn(['byId', '123']).toJS());
      expect(result.getIn(['byId', '123']).toJS()).to.deep.equal({
        url: 'http://test.com',
        closedAt: 'tomorrow',
        id: '123'
      });
      expect(result.getIn(['ids']).toJS()).to.deep.equal([
        '123',
        '456'
      ]);
      expect(result.getIn(['count'])).to.equal(200);
    });
  });
});
