import {addNotification} from '../actions/notification';
import coralApi from '../helpers/response';
import * as actions from '../constants/auth';

import I18n from 'coral-i18n/modules/i18n/i18n';
const lang = new I18n();

const editUsernameFailure = error => ({type: actions.EDIT_USERNAME_FAILURE, error});
const editUsernameSuccess = () => ({type: actions.EDIT_USERNAME_SUCCESS});

export const editName = (username) => (dispatch) => {
  return coralApi('/account/username', {method: 'PUT', body: {username}})
    .then(() => {
      dispatch(editUsernameSuccess());
      dispatch(addNotification('success', lang.t('framework.success_name_update')));
    })
    .catch(error => {
      dispatch(editUsernameFailure(lang.t(`error.${error.translation_key}`)));
    });
};
