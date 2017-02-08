import {addNotification} from '../actions/notification';
import coralApi from '../helpers/response';

import I18n from 'coral-framework/modules/i18n/i18n';
import translations from './../translations';
const lang = new I18n(translations);

export const editName = (displayName) => (dispatch) => {
  return coralApi('/account/displayname', {method: 'PUT', body: {displayName}})
    .then(() => {
      dispatch(addNotification('success', lang.t('successNameUpdate')));
    });
};
