import qs from 'qs';

import {
  FETCH_COMMENTERS_REQUEST,
  FETCH_COMMENTERS_SUCCESS,
  FETCH_COMMENTERS_FAILURE,
  SORT_UPDATE,
  COMMENTERS_NEW_PAGE,
  SET_ROLE,
  SET_COMMENTER_STATUS
} from '../constants/community';

import coralApi from '../../../coral-framework/helpers/response';

export const fetchCommenters = (query = {}) => dispatch => {
  dispatch(requestFetchCommenters());
  coralApi(`/users?${qs.stringify(query)}`)
    .then(({result, page, count, limit, totalPages}) =>
      dispatch({
        type: FETCH_COMMENTERS_SUCCESS,
        commenters: result,
        page,
        count,
        limit,
        totalPages
      })
    )
    .catch(error => dispatch({type: FETCH_COMMENTERS_FAILURE, error}));
};

const requestFetchCommenters = () => ({
  type: FETCH_COMMENTERS_REQUEST
});

export const updateSorting = sort => ({
  type: SORT_UPDATE,
  sort
});

export const newPage = () => ({
  type: COMMENTERS_NEW_PAGE
});

export const setRole = (id, role) => (dispatch, getState) => {

  const _csrf = getState().auth.get('_csrf');
  return coralApi(`/users/${id}/role`, {method: 'POST', body: {role}, _csrf: _csrf})
  .then(() => dispatch({type: SET_ROLE, id, role}));
};

export const setCommenterStatus = (id, status) => (dispatch, getState) => {
  const _csrf = getState().auth.get('_csrf');
  return coralApi(`/users/${id}/status`, {method: 'POST', body: {status}, _csrf: _csrf})
  .then(() => {
    return dispatch({type: SET_COMMENTER_STATUS, id, status});
  });
};
