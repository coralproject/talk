import * as actions from '../constants/user';
import {addNotification} from '../actions/notification';
import coralApi from '../helpers/response';

import I18n from 'coral-framework/modules/i18n/i18n';
import translations from './../translations';
const lang = new I18n(translations);

const saveBioRequest = () => ({type: actions.SAVE_BIO_REQUEST});
const saveBioSuccess = settings => ({type: actions.SAVE_BIO_SUCCESS, settings});
const saveBioFailure = error => ({type: actions.SAVE_BIO_FAILURE, error});

export const saveBio = (user_id, formData) => dispatch => {
  dispatch(saveBioRequest());
  coralApi(`/users/${user_id}/bio`, {method: 'PUT', body: formData})
    .then(({settings}) => {
      dispatch(addNotification('success', lang.t('successBioUpdate')));
      dispatch(saveBioSuccess(settings));
    })
    .catch(error => dispatch(saveBioFailure(error)));
};
