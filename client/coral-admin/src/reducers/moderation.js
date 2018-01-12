import * as actions from '../constants/moderation';

const initialState = {
  singleView: false,
  modalOpen: false,
  storySearchVisible: false,
  storySearchString: '',
  shortcutsNoteVisible: 'show',
  sortOrder: 'DESC',
  selectedCommentId: '',
};

export default function moderation(state = initialState, action) {
  switch (action.type) {
    case actions.MODERATION_CLEAR_STATE:
      return {
        ...initialState,
        shortcutsNoteVisible: state.shortcutsNoteVisible,
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
    case actions.MODERATION_SELECT_COMMENT:
      return {
        ...state,
        selectedCommentId: action.id,
      };
    default:
      return state;
  }
}
