import { addNotification } from '../actions/notification';
import coralApi from '../helpers/response';

import I18n from 'coral-framework/modules/i18n/i18n';
import translations from './../translations';
const lang = new I18n(translations);

export const editName = (username) => (dispatch) => {
  return coralApi('/account/username', { method: 'PUT', body: { username } })
    .then(() => {
      dispatch(addNotification('success', lang.t('successNameUpdate')));
    });
};
