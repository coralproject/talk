import qs from 'qs';

import {
  FETCH_COMMENTERS_REQUEST,
  FETCH_COMMENTERS_SUCCESS,
  FETCH_COMMENTERS_FAILURE,
  SORT_UPDATE,
  COMMENTERS_NEW_PAGE,
  SET_ROLE,
  SET_COMMENTER_STATUS,
  FETCH_FLAGGED_COMMENTERS_REQUEST,
  FETCH_FLAGGED_COMMENTERS_SUCCESS,
  FETCH_FLAGGED_COMMENTERS_FAILURE
} from '../constants/community';

import coralApi from '../../../coral-framework/helpers/response';

export const fetchAccounts = (query = {}) => dispatch => {
  dispatch(requestFetchAccounts());
  coralApi(`/users?${qs.stringify(query)}`)
    .then(({result, page, count, limit, totalPages}) =>
      dispatch({
        type: FETCH_COMMENTERS_SUCCESS,
        accounts: result,
        page,
        count,
        limit,
        totalPages
      })
    )
    .catch(error => dispatch({type: FETCH_COMMENTERS_FAILURE, error}));
};

const requestFetchAccounts = () => ({
  type: FETCH_COMMENTERS_REQUEST
});

export const updateSorting = sort => ({
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

// Fetch flagged accounts to display in the moderation queue of the community.

export const fetchFlaggedAccounts = (query = {}) => dispatch => {
  dispatch(requestFetchFlaggedAccounts());
  coralApi(`/users?${qs.stringify(query)}`)
    .then(({result, page, count, limit, totalPages}) =>
      dispatch({
        type: FETCH_FLAGGED_COMMENTERS_SUCCESS,
        flaggedAccounts: result,
        page,
        count,
        limit,
        totalPages
      })
    )
    .catch(error => dispatch({type: FETCH_FLAGGED_COMMENTERS_FAILURE, error}));
};

const requestFetchFlaggedAccounts = () => ({
  type: FETCH_FLAGGED_COMMENTERS_REQUEST
});
