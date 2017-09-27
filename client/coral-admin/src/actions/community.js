import queryString from 'query-string';

import {
  FETCH_COMMENTERS_REQUEST,
  FETCH_COMMENTERS_SUCCESS,
  FETCH_COMMENTERS_FAILURE,
  SORT_UPDATE,
  COMMENTERS_NEW_PAGE,
  SET_ROLE,
  SET_COMMENTER_STATUS,
  SHOW_BANUSER_DIALOG,
  HIDE_BANUSER_DIALOG,
  SHOW_REJECT_USERNAME_DIALOG,
  HIDE_REJECT_USERNAME_DIALOG
} from '../constants/community';

import t from 'coral-framework/services/i18n';

export const fetchAccounts = (query = {}) => (dispatch, _, {rest}) => {
  dispatch(requestFetchAccounts());
  rest(`/users?${queryString.stringify(query)}`)
    .then(({result, page, count, limit, totalPages}) =>{
      dispatch({
        type: FETCH_COMMENTERS_SUCCESS,
        accounts: result,
        page,
        count,
        limit,
        totalPages
      });
    })
    .catch((error) => {
      console.error(error);
      const errorMessage = error.translation_key ? t(`error.${error.translation_key}`) : error.toString();
      dispatch({type: FETCH_COMMENTERS_FAILURE, error: errorMessage});
    });
};

const requestFetchAccounts = () => ({
  type: FETCH_COMMENTERS_REQUEST
});

export const updateSorting = (sort) => ({
  type: SORT_UPDATE,
  sort
});

export const newPage = () => ({
  type: COMMENTERS_NEW_PAGE
});

export const setRole = (id, role) => (dispatch, _, {rest}) => {
  return rest(`/users/${id}/role`, {method: 'POST', body: {role}})
    .then(() => {
      return dispatch({type: SET_ROLE, id, role});
    });
};

export const setCommenterStatus = (id, status) => (dispatch, _, {rest}) => {
  return rest(`/users/${id}/status`, {method: 'POST', body: {status}})
    .then(() => {
      return dispatch({type: SET_COMMENTER_STATUS, id, status});
    });
};

// Ban User Dialog
export const showBanUserDialog = (user) => ({type: SHOW_BANUSER_DIALOG, user});
export const hideBanUserDialog = () => ({type: HIDE_BANUSER_DIALOG});

// Reject Username Dialog
export const showRejectUsernameDialog = (user) => ({type: SHOW_REJECT_USERNAME_DIALOG, user});
export const hideRejectUsernameDialog = () => ({type: HIDE_REJECT_USERNAME_DIALOG});
