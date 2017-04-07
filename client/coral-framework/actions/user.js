import {addNotification} from '../actions/notification';
import coralApi from '../helpers/response';
import * as actions from '../constants/auth';
import {IGNORE_USER_SUCCESS} from '../constants/user';

import I18n from 'coral-framework/modules/i18n/i18n';
import translations from './../translations';
const lang = new I18n(translations);

const editUsernameFailure = error => ({type: actions.EDIT_USERNAME_FAILURE, error});
const editUsernameSuccess = () => ({type: actions.EDIT_USERNAME_SUCCESS});

export const editName = (username) => (dispatch) => {
  return coralApi('/account/username', {method: 'PUT', body: {username}})
    .then(() => {
      dispatch(editUsernameSuccess());
      dispatch(addNotification('success', lang.t('successNameUpdate')));
    })
    .catch(error => {
      dispatch(editUsernameFailure(lang.t(`error.${error.translation_key}`)));
    });
};

// a user was successfully ignored
export const ignoreUserSuccess = ({id}) => ({type: IGNORE_USER_SUCCESS, id});
