/**
 * Action disptacher related to users
 */

 // Dialog Actions
export const showBanUserDialog = () => ({type: 'SHOW_BANUSER_DIALOG'});
export const hideBanUserDialog = () => ({type: 'HIDE_BANUSER_DIALOG'});

export const banUser = (status, id, author_id) => (dispatch) => {
  dispatch({type: 'USER_STATUS_UPDATE', id, author_id, status});
};
