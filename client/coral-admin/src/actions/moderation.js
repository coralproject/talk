import * as actions from 'constants/moderation';

export const toggleModal = (open) => ({type: actions.TOGGLE_MODAL, open});
export const singleView = () => ({type: actions.SINGLE_VIEW});

// Ban User Dialog
export const showBanUserDialog = (user, commentId, commentStatus, showRejectedNote) => ({type: actions.SHOW_BANUSER_DIALOG, user, commentId, commentStatus, showRejectedNote});
export const hideBanUserDialog = (showDialog) => ({type: actions.HIDE_BANUSER_DIALOG, showDialog});

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
