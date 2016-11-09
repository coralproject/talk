/* Items Reducer */

import {fromJS} from 'immutable';
import * as actions from '../actions/items';

const initialState = fromJS({});

export default (state = initialState, action) => {
  switch (action.type) {
  case actions.ADD_ITEM:
    return state.set(action.id, fromJS(action.item));
  case actions.UPDATE_ITEM:
    return state.updateIn([action.id, action.property], () =>
        fromJS(action.value)
      );
  case actions.APPEND_ITEM_ARRAY:
    return state.updateIn([action.id, action.property], (prop) => {
      if (action.addToFront) {
        return prop ? prop.unshift(action.value) : fromJS([action.value]);
      } else {
        return prop ? prop.push(action.value) : fromJS([action.value]);
      }

    }
    );
  default:
    return state;
  }
};
