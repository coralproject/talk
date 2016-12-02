import actions from '../constants/users';
/**
 * Action disptacher related to users
 */

// Dialog Actions
export const showBanUserDialog = () => (dispatch) => {
  dispatch({type: actions.SHOW_BANUSER_DIALOG});
};
export const hideBanUserDialog = () => (dispatch) => {
  dispatch({type: actions.HIDE_BANUSER_DIALOG});
};

export const banUser = (status, id, author_id) => (dispatch) => {
  dispatch({type: 'USER_STATUS_UPDATE', id, author_id, status});
};
