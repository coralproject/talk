import {Map} from 'immutable';
import * as actions from '../constants/embedStream';

const initialState = Map({
  tab: 'COMMENT_BOX'
});

export default function embedStream (state = initialState, action) {
  switch (action.type) {
  case actions.CHANGE_TAB :
    return state
      .set('tab', action.tab);
  default :
    return state;
  }
}
