import {addNotification} from '../actions/notification';
import coralApi from '../helpers/request';
import * as actions from '../constants/auth';

import t from 'coral-framework/services/i18n';

const editUsernameFailure = (error) => ({type: actions.EDIT_USERNAME_FAILURE, error});
const editUsernameSuccess = () => ({type: actions.EDIT_USERNAME_SUCCESS});

export const editName = (username) => (dispatch) => {
  return coralApi('/account/username', {method: 'PUT', body: {username}})
    .then(() => {
      dispatch(editUsernameSuccess());
      dispatch(addNotification('success', t('framework.success_name_update')));
    })
    .catch((error) => {
      console.error(error);
      const errorMessage = error.translation_key ? t(`error.${error.translation_key}`) : error.toString();
      dispatch(editUsernameFailure(errorMessage));
    });
};
