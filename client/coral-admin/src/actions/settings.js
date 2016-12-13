import coralApi from '../../../coral-framework/helpers/response';

export const SETTINGS_LOADING = 'SETTINGS_LOADING';
export const SETTINGS_RECEIVED = 'SETTINGS_RECEIVED';
export const SETTINGS_FETCH_ERROR = 'SETTINGS_FETCH_ERROR';

export const SETTINGS_UPDATED = 'SETTINGS_UPDATED';

export const SAVE_SETTINGS_LOADING = 'SAVE_SETTINGS_LOADING';
export const SAVE_SETTINGS_SUCCESS = 'SAVE_SETTINGS_SUCCESS';
export const SAVE_SETTINGS_FAILED = 'SAVE_SETTINGS_FAILED';

export const fetchSettings = () => dispatch => {
  dispatch({type: SETTINGS_LOADING});
  coralApi('/settings')
    .then(settings => {
      dispatch({type: SETTINGS_RECEIVED, settings});
    })
    .catch(error => {
      dispatch({type: SETTINGS_FETCH_ERROR, error});
    });
};

export const updateSettings = settings => {
  return {type: SETTINGS_UPDATED, settings};
};

export const saveSettingsToServer = () => (dispatch, getState) => {
  let settings = getState().settings.toJS().settings;
  if (settings.charCount) {
    settings.charCount = parseInt(settings.charCount);
  }
  dispatch({type: SAVE_SETTINGS_LOADING});
  coralApi('/settings', {method: 'PUT', body: settings})
    .then(() => {
      dispatch({type: SAVE_SETTINGS_SUCCESS, settings});
    })
    .catch(error => {
      dispatch({type: SAVE_SETTINGS_FAILED, error});
    });
};
