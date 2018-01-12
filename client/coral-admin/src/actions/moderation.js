import * as actions from 'constants/moderation';

export const toggleModal = open => ({ type: actions.TOGGLE_MODAL, open });
export const singleView = () => ({ type: actions.SINGLE_VIEW });

// hide shortcuts note
export const hideShortcutsNote = () => (dispatch, _, { storage }) => {
  try {
    if (storage) {
      storage.setItem('coral:shortcutsNote', 'hide');
    }
  } catch (e) {
    // above will fail in Safari private mode
  }

  dispatch({ type: actions.HIDE_SHORTCUTS_NOTE });
};

export const setSortOrder = order => ({
  type: actions.SET_SORT_ORDER,
  order,
});

export const toggleStorySearch = active => ({
  type: active ? actions.SHOW_STORY_SEARCH : actions.HIDE_STORY_SEARCH,
});

export const storySearchChange = value => ({
  type: actions.STORY_SEARCH_CHANGE_VALUE,
  value,
});

export const clearState = () => ({
  type: actions.MODERATION_CLEAR_STATE,
});

export const selectCommentId = id => ({
  type: actions.MODERATION_SELECT_COMMENT,
  id,
});
