/* Items Reducer */

import {fromJS} from 'immutable';
import * as actions from '../actions/items';

const initialState = fromJS({
  comments: {},
  users: {},
  assets: {},
  actions: {}
});

export default (state = initialState, action) => {
  switch (action.type) {
  case actions.ADD_ITEM:
    return state.setIn([action.item_type, action.id], fromJS(action.item));
  case actions.UPDATE_ITEM:
    return state.setIn([action.item_type, action.id, action.property], fromJS(action.value));
  case actions.APPEND_ITEM_ARRAY:
    return state.updateIn([action.item_type, action.id, action.property], (prop) => {
      if (action.add_to_front) {
        return prop ? prop.unshift(fromJS(action.value)) : fromJS([action.value]);
      } else {
        return prop ? prop.push(fromJS(action.value)) : fromJS([action.value]);
      }
    });
  default:
    return state;
  }
};
