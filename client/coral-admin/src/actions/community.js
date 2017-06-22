import qs from 'qs';

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
  SHOW_SUSPENDUSER_DIALOG,
  HIDE_SUSPENDUSER_DIALOG
} from '../constants/community';

import coralApi from '../../../coral-framework/helpers/request';
import t from 'coral-framework/services/i18n';

export const fetchAccounts = (query = {}) => (dispatch) => {

  dispatch(requestFetchAccounts());
  coralApi(`/users?${qs.stringify(query)}`)
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

export const setRole = (id, role) => (dispatch) => {
  return coralApi(`/users/${id}/role`, {method: 'POST', body: {role}})
  .then(() => {
    return dispatch({type: SET_ROLE, id, role});
  });
};

export const setCommenterStatus = (id, status) => (dispatch) => {
  return coralApi(`/users/${id}/status`, {method: 'POST', body: {status}})
  .then(() => {
    return dispatch({type: SET_COMMENTER_STATUS, id, status});
  });
};

// Ban User Dialog
export const showBanUserDialog = (user) => ({type: SHOW_BANUSER_DIALOG, user});
export const hideBanUserDialog = () => ({type: HIDE_BANUSER_DIALOG});

// Suspend User Dialog
export const showSuspendUserDialog = (user) => ({type: SHOW_SUSPENDUSER_DIALOG, user});
export const hideSuspendUserDialog = () => ({type: HIDE_SUSPENDUSER_DIALOG});
