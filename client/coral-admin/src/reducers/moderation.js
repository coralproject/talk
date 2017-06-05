import {fromJS, Map} from 'immutable';
import * as actions from '../constants/moderation';

const initialState = fromJS({
  singleView: false,
  modalOpen: false,
  user: {},
  commentId: null,
  commentStatus: null,
  userDetailId: null,
  userDetailActiveTab: 'all',
  userDetailStatuses: ['NONE', 'ACCEPTED', 'REJECTED', 'PREMOD'],
  banDialog: false,
  shortcutsNoteVisible: window.localStorage.getItem('coral:shortcutsNote') || 'show',
  sortOrder: 'REVERSE_CHRONOLOGICAL',
  suspendUserDialog: {
    show: false,
    userId: null,
    username: '',
    commentId: null,
    commentStatus: '',
  },
});

export default function moderation (state = initialState, action) {
  switch (action.type) {
  case actions.HIDE_BANUSER_DIALOG:
    return state
      .set('banDialog', false)
      .set('commentStatus', null);
  case actions.SHOW_BANUSER_DIALOG:
    return state
      .merge({
        user: Map(action.user),
        commentId: action.commentId,
        commentStatus: action.commentStatus,
        showRejectedNote: action.showRejectedNote,
        banDialog: true
      });
  case actions.SHOW_SUSPEND_USER_DIALOG:
    return state
      .mergeDeep({
        suspendUserDialog: {
          show: true,
          userId: action.userId,
          username: action.username,
          commentId: action.commentId,
          commentStatus: action.commentStatus,
        }
      });
  case actions.HIDE_SUSPEND_USER_DIALOG:
    return state
      .setIn(['suspendUserDialog', 'show'], false);
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
    return state.set('userDetailId', null);
  case actions.CHANGE_USER_DETAIL_STATUSES:
    return state
      .set('userDetailActiveTab', action.tab)
      .set('userDetailStatuses', action.statuses);
  case actions.SET_SORT_ORDER:
    return state.set('sortOrder', action.order);
  default :
    return state;
  }
}
