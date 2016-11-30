import * as actions from '../constants/user';
import {base, handleResp, getInit} from '../helpers/response';

const saveBioRequest = () => ({type: actions.SAVE_BIO_REQUEST});
const saveBioSuccess = settings => ({type: actions.SAVE_BIO_SUCCESS, settings});
const saveBioFailure = error => ({type: actions.SAVE_BIO_FAILURE, error});

export const saveBio = (user_id, formData) => dispatch => {
  dispatch(saveBioRequest());
  fetch(`${base}/user/${user_id}/bio`, getInit('PUT', formData))
    .then(handleResp)
    .then(({settings}) => {
      dispatch(saveBioSuccess(settings));
    })
    .catch(error => dispatch(saveBioFailure(error)));
};
