import * as actions from '../constants/moderation';

const initialState = {
  singleView: false,
  modalOpen: false,
  storySearchVisible: false,
  storySearchString: '',
  shortcutsNoteVisible: 'show',
  sortOrder: 'DESC',
  selectedCommentId: '',
  // If true the activity indicator will turn on subscriptions
  // in order to determine queue counts. Set this to false
  // if the queue count is determined by other means.
  indicatorTrack: true,
};

export default function moderation(state = initialState, action) {
  switch (action.type) {
    case actions.CLEAR_STATE:
      return {
        ...initialState,
        shortcutsNoteVisible: state.shortcutsNoteVisible,
        indicatorTrack: state.indicatorTrack,
      };
    case actions.TOGGLE_MODAL:
      return {
        ...state,
        modalOpen: action.open,
      };
    case actions.SINGLE_VIEW:
      return {
        ...state,
        singleView: !state.singleView,
      };
    case actions.HIDE_SHORTCUTS_NOTE:
      return {
        ...state,
        shortcutsNoteVisible: 'hide',
      };
    case actions.SHOW_STORY_SEARCH:
      return {
        ...state,
        storySearchVisible: true,
      };
    case actions.HIDE_STORY_SEARCH:
      return {
        ...state,
        storySearchVisible: false,
      };
    case actions.STORY_SEARCH_CHANGE_VALUE:
      return {
        ...state,
        storySearchString: action.value,
      };
    case actions.SET_SORT_ORDER:
      return {
        ...state,
        sortOrder: action.order,
      };
    case actions.SELECT_COMMENT:
      return {
        ...state,
        selectedCommentId: action.id,
      };
    case actions.SET_INDICATOR_TRACK:
      return {
        ...state,
        indicatorTrack: action.track,
      };
    default:
      return state;
  }
}
