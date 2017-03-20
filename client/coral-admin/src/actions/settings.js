import coralApi from '../../../coral-framework/helpers/response';

export const SETTINGS_LOADING = 'SETTINGS_LOADING';
export const SETTINGS_RECEIVED = 'SETTINGS_RECEIVED';
export const SETTINGS_FETCH_ERROR = 'SETTINGS_FETCH_ERROR';

export const SETTINGS_UPDATED = 'SETTINGS_UPDATED';

export const SAVE_SETTINGS_LOADING = 'SAVE_SETTINGS_LOADING';
export const SAVE_SETTINGS_SUCCESS = 'SAVE_SETTINGS_SUCCESS';
export const SAVE_SETTINGS_FAILED = 'SAVE_SETTINGS_FAILED';

export const WORDLIST_UPDATED = 'WORDLIST_UPDATED';
export const DOMAINLIST_UPDATED = 'DOMAINLIST_UPDATED';

export const fetchSettings = () => dispatch => {
  dispatch({ type: SETTINGS_LOADING });
  coralApi('/settings')
    .then(settings => {
      dispatch({ type: SETTINGS_RECEIVED, settings });
    })
    .catch(error => {
      dispatch({ type: SETTINGS_FETCH_ERROR, error });
    });
};

// for updating top-level settings
export const updateSettings = settings => {
  return { type: SETTINGS_UPDATED, settings };
};

// this is a nested property, so it needs a special action.
export const updateWordlist = (listName, list) => {
  return { type: WORDLIST_UPDATED, listName, list };
};

export const updateDomainlist = (listName, list) => {
  return { type: DOMAINLIST_UPDATED, listName, list };
};

export const saveSettingsToServer = () => (dispatch, getState) => {
  let settings = getState().settings.toJS();
  if (settings.charCount) {
    settings.charCount = parseInt(settings.charCount);
  }
  dispatch({ type: SAVE_SETTINGS_LOADING });
  coralApi('/settings', { method: 'PUT', body: settings })
    .then(() => {
      dispatch({ type: SAVE_SETTINGS_SUCCESS, settings });
    })
    .catch(error => {
      dispatch({ type: SAVE_SETTINGS_FAILED, error });
    });
};
