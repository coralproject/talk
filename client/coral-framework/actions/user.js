import {addNotification} from '../actions/notification';
import coralApi from '../helpers/response';
import * as actions from '../constants/auth';

import t from 'coral-i18n/services/i18n';

const editUsernameFailure = (error) => ({type: actions.EDIT_USERNAME_FAILURE, error});
const editUsernameSuccess = () => ({type: actions.EDIT_USERNAME_SUCCESS});

export const editName = (username) => (dispatch) => {
  return coralApi('/account/username', {method: 'PUT', body: {username}})
    .then(() => {
      dispatch(editUsernameSuccess());
      dispatch(addNotification('success', t('framework.success_name_update')));
    })
    .catch((error) => {
      dispatch(editUsernameFailure(t(`error.${error.translation_key}`)));
    });
};
