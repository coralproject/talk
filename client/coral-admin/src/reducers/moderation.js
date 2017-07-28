import {fromJS} from 'immutable';
import * as actions from '../constants/moderation';

const initialState = fromJS({
  singleView: false,
  modalOpen: false,
  storySearchVisible: false,
  storySearchString: '',
  shortcutsNoteVisible: window.localStorage.getItem('coral:shortcutsNote') || 'show',
  sortOrder: 'REVERSE_CHRONOLOGICAL',
});

export default function moderation (state = initialState, action) {
  switch (action.type) {
  case actions.MODERATION_CLEAR_STATE:
    return initialState;
  case actions.TOGGLE_MODAL:
    return state
      .set('modalOpen', action.open);
  case actions.SINGLE_VIEW:
    return state
      .set('singleView', !state.get('singleView'));
  case actions.HIDE_SHORTCUTS_NOTE:
    return state
      .set('shortcutsNoteVisible', 'hide');
  case actions.SHOW_STORY_SEARCH:
    return state.set('storySearchVisible', true);
  case actions.HIDE_STORY_SEARCH:
    return state.set('storySearchVisible', false);
  case actions.STORY_SEARCH_CHANGE_VALUE:
    return state.set('storySearchString', action.value);
  case actions.SET_SORT_ORDER:
    return state.set('sortOrder', action.order);
  default :
    return state;
  }
}
