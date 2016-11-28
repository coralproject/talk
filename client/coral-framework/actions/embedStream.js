import {base, handleResp, getInit} from '../helpers/response';
import * as actions from '../constants/embedStream';

export const changeTab = activeTab => dispatch =>
  dispatch({
    type: actions.CHANGE_TAB,
    activeTab
  });

const userBioRequest = () => ({type: actions.FETCH_USER_BIO_REQUEST});
const userBioSuccess = userBio => ({type: actions.FETCH_USER_BIO_SUCCESS, userBio});
const userBioFailure = error => ({type: actions.FETCH_USER_BIO_FAILURE, error});

export const fetchUserBio = () => dispatch => {
  dispatch(userBioRequest());
  fetch(`${base}/bio`, getInit('GET'))
    .then(handleResp)
    .then(({bio}) => {
      dispatch(userBioSuccess(bio));
    })
    .catch(() => dispatch(userBioFailure()));
};
