import {fromJS, Set} from 'immutable';
import * as actions from '../constants/moderation';

const initialState = fromJS({
  singleView: false,
  modalOpen: false,
  userDetailId: null,
  userDetailActiveTab: 'all',
  userDetailStatuses: ['NONE', 'ACCEPTED', 'REJECTED', 'PREMOD'],
  userDetailSelectedIds: new Set(),
  storySearchVisible: false,
  storySearchString: '',
  shortcutsNoteVisible: window.localStorage.getItem('coral:shortcutsNote') || 'show',
  sortOrder: 'REVERSE_CHRONOLOGICAL',
});

export default function moderation (state = initialState, action) {
  switch (action.type) {
  case actions.MODERATION_CLEAR_STATE:
    return initialState;
  case actions.SET_ACTIVE_TAB:
    return state
      .set('activeTab', action.activeTab);
  case actions.TOGGLE_MODAL:
    return state
      .set('modalOpen', action.open);
  case actions.SINGLE_VIEW:
    return state
      .set('singleView', !state.get('singleView'));
  case actions.HIDE_SHORTCUTS_NOTE:
    return state
      .set('shortcutsNoteVisible', 'hide');
  case actions.VIEW_USER_DETAIL:
    return state.set('userDetailId', action.userId);
  case actions.HIDE_USER_DETAIL:
    return state
      .set('userDetailId', null)
      .update('userDetailSelectedIds', (set) => set.clear());
  case actions.CLEAR_USER_DETAIL_SELECTIONS:
    return state.update('userDetailSelectedIds', (set) => set.clear());
  case actions.CHANGE_USER_DETAIL_STATUSES:
    return state
      .set('userDetailActiveTab', action.tab)
      .set('userDetailStatuses', action.statuses);
  case actions.SELECT_USER_DETAIL_COMMENT:
    return state.update('userDetailSelectedIds', (set) => set.add(action.id));
  case actions.UNSELECT_USER_DETAIL_COMMENT:
    return state.update('userDetailSelectedIds', (set) => set.delete(action.id));
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
