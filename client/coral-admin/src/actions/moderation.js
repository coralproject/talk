import * as actions from 'constants/moderation';

export const setActiveTab = activeTab => ({type: actions.SET_ACTIVE_TAB, activeTab});
export const toggleModal = open => ({type: actions.TOGGLE_MODAL, open});
export const singleView = () => ({type: actions.SINGLE_VIEW});

// Ban User Dialog
export const showBanUserDialog = (userId, userName, commentId) => {
  return {type: actions.SHOW_BANUSER_DIALOG, userId, userName, commentId};
};

export const hideBanUserDialog = (showDialog) => {
  return {type: actions.HIDE_BANUSER_DIALOG, showDialog};
};
