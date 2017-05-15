import * as actions from 'constants/moderation';

export const toggleModal = open => ({type: actions.TOGGLE_MODAL, open});
export const singleView = () => ({type: actions.SINGLE_VIEW});

// Ban User Dialog
export const showBanUserDialog = (user, commentId, commentStatus, showRejectedNote) => ({type: actions.SHOW_BANUSER_DIALOG, user, commentId, commentStatus, showRejectedNote});
export const hideBanUserDialog = (showDialog) => ({type: actions.HIDE_BANUSER_DIALOG, showDialog});

// Suspend User Dialog
export const showSuspendUserDialog = (userId, username, commentId, commentStatus) =>
  ({type: actions.SHOW_SUSPEND_USER_DIALOG, userId, username, commentId, commentStatus});

export const hideSuspendUserDialog = () => ({type: actions.HIDE_SUSPEND_USER_DIALOG});

// hide shortcuts note
export const hideShortcutsNote = () => {
  try {
    window.localStorage.setItem('coral:shortcutsNote', 'hide');
  } catch (e) {

    // above will fail in Safari private mode
  }

  return {type: actions.HIDE_SHORTCUTS_NOTE};
};
