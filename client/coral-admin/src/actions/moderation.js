import * as actions from 'constants/moderation';

export const toggleModal = open => ({type: actions.TOGGLE_MODAL, open});
export const singleView = () => ({type: actions.SINGLE_VIEW});

// Ban User Dialog
export const showBanUserDialog = (user, commentId, showRejectedNote) => ({type: actions.SHOW_BANUSER_DIALOG, user, commentId, showRejectedNote});
export const hideBanUserDialog = (showDialog) => ({type: actions.HIDE_BANUSER_DIALOG, showDialog});
