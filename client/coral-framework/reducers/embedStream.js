import {Map} from 'immutable';
import * as actions from '../constants/embedStream';

const initialState = Map({
  activeTab: 0
});

export default function embedStream (state = initialState, action) {
  switch (action.type) {
  case actions.CHANGE_TAB :
    return state
      .set('activeTab', action.activeTab);
  default :
    return state;
  }
}
