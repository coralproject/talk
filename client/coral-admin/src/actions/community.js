import qs from 'qs';

import {
  FETCH_COMMENTERS_REQUEST,
  FETCH_COMMENTERS_SUCCESS,
  FETCH_COMMENTERS_FAILURE
} from '../constants/community';

import {base, getInit, handleResp} from '../helpers/response';

export const fetchCommenters = (query = {}) => (dispatch) => {
  dispatch(requestFetchCommenters());
  fetch(`${base}/user?${qs.stringify(query)}`, getInit('GET'))
    .then(handleResp)
    .then((commenters) => {
      dispatch({type: FETCH_COMMENTERS_SUCCESS, commenters});
    })
    .catch((error) => {
      dispatch({type: FETCH_COMMENTERS_FAILURE, error});
    });
};

const requestFetchCommenters = () => ({
  type: FETCH_COMMENTERS_REQUEST
});
