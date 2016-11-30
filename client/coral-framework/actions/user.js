import * as actions from '../constants/user';
import {base, handleResp, getInit} from '../helpers/response';

const saveBioRequest = () => ({type: actions.SAVE_BIO_REQUEST});
const saveBioSuccess = user => ({type: actions.SAVE_BIO_SUCCESS, user});
const saveBioFailure = error => ({type: actions.SAVE_BIO_FAILURE, error});

export const saveBio = (user_id, formData) => dispatch => {
  dispatch(saveBioRequest());
  fetch(`${base}/${user_id}/bio`, getInit('POST', formData))
    .then(handleResp)
    .then(({user}) => {
      dispatch(saveBioSuccess(user));
    })
    .catch(error => dispatch(saveBioFailure(error)));
};
