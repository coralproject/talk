import * as actions from 'constants/moderation';

export const toggleModal = (open) => ({type: actions.TOGGLE_MODAL, open});
export const singleView = () => ({type: actions.SINGLE_VIEW});

// hide shortcuts note
export const hideShortcutsNote = () => {
  try {
    window.localStorage.setItem('coral:shortcutsNote', 'hide');
  } catch (e) {

    // above will fail in Safari private mode
  }

  return {type: actions.HIDE_SHORTCUTS_NOTE};
};

export const viewUserDetail = (userId) => ({type: actions.VIEW_USER_DETAIL, userId});
export const hideUserDetail = () => ({type: actions.HIDE_USER_DETAIL});

export const setSortOrder = (order) => ({
  type: actions.SET_SORT_ORDER,
  order
});

export const changeUserDetailStatuses = (tab) => {
  let statuses;
  if (tab === 'all') {
    statuses = ['NONE', 'ACCEPTED', 'REJECTED', 'PREMOD'];
  } else if (tab === 'rejected') {
    statuses = ['REJECTED'];
  }
  return {type: actions.CHANGE_USER_DETAIL_STATUSES, tab, statuses};
};

export const clearUserDetailSelections = () => ({type: actions.CLEAR_USER_DETAIL_SELECTIONS});

export const toggleSelectCommentInUserDetail = (id, active) => {
  return {
    type: active ? actions.SELECT_USER_DETAIL_COMMENT : actions.UNSELECT_USER_DETAIL_COMMENT,
    id
  };
};

export const toggleStorySearch = (active) => ({
  type: active ? actions.SHOW_STORY_SEARCH : actions.HIDE_STORY_SEARCH
});

export const storySearchChange = (value) => ({
  type: actions.STORY_SEARCH_CHANGE_VALUE,
  value
});

export const clearState = () => ({
  type: actions.MODERATION_CLEAR_STATE
});
