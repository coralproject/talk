import qs from 'qs';

import {
  FETCH_COMMENTERS_REQUEST,
  FETCH_COMMENTERS_SUCCESS,
  FETCH_COMMENTERS_FAILURE,
  SORT_UPDATE,
  COMMENTERS_NEW_PAGE,
  SET_ROLE
} from '../constants/community';

import {base, getInit, handleResp} from '../helpers/response';

export const fetchCommenters = (query = {}) => dispatch => {
  dispatch(requestFetchCommenters());
  fetch(`${base}/user?${qs.stringify(query)}`, getInit('GET'))
    .then(handleResp)
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

export const setRole = (id, role) => dispatch => {
  return fetch(`${base}/user/${id}/role`, getInit('POST', {role}))
  .then(() => {
    return dispatch({type: SET_ROLE, id, role});
  });
};
