import {Map} from 'immutable';
import * as actions from '../constants/moderation';

const initialState = Map({
  activeTab: 'all',
  singleView: false,
  modalOpen: false
});

export default function moderation (state = initialState, action) {
  switch (action.type) {
  case actions.SET_ACTIVE_TAB:
    return state
      .set('activeTab', action.activeTab);
  case actions.TOGGLE_MODAL:
    return state
      .set('modalOpen', action.open);
  case actions.SINGLE_VIEW:
    return state
      .set('singleView', !state.get('singleView'));
  default :
    return state;
  }
}
