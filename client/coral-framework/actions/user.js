import * as actions from '../constants/user';
import {base, handleResp, getInit} from '../helpers/response';

const saveBioRequest = () => ({type: actions.SAVE_BIO_REQUEST});
const saveBioSuccess = bio => ({type: actions.SAVE_BIO_SUCCESS, bio});
const saveBioFailure = error => ({type: actions.SAVE_BIO_FAILURE, error});

export const saveBio = (formData) => dispatch => {
  dispatch(saveBioRequest());
  fetch(`${base}/auth/local`, getInit('POST', formData))
    .then(handleResp)
    .then(({user}) => {
      dispatch(saveBioSuccess(user));
    })
    .catch(error => dispatch(saveBioFailure(error)));
};
