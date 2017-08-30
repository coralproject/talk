import t from 'coral-framework/services/i18n';

export const SETTINGS_LOADING = 'SETTINGS_LOADING';
export const SETTINGS_RECEIVED = 'SETTINGS_RECEIVED';
export const SETTINGS_FETCH_ERROR = 'SETTINGS_FETCH_ERROR';

export const SETTINGS_UPDATED = 'SETTINGS_UPDATED';

export const SAVE_SETTINGS_LOADING = 'SAVE_SETTINGS_LOADING';
export const SAVE_SETTINGS_SUCCESS = 'SAVE_SETTINGS_SUCCESS';
export const SAVE_SETTINGS_FAILED = 'SAVE_SETTINGS_FAILED';

export const WORDLIST_UPDATED = 'WORDLIST_UPDATED';
export const DOMAINLIST_UPDATED = 'DOMAINLIST_UPDATED';

export const fetchSettings = () => (dispatch, _, {rest}) => {
  dispatch({type: SETTINGS_LOADING});
  rest('/settings')
    .then((settings) => {
      dispatch({type: SETTINGS_RECEIVED, settings});
    })
    .catch((error) => {
      console.error(error);
      const errorMessage = error.translation_key ? t(`error.${error.translation_key}`) : error.toString();
      dispatch({type: SETTINGS_FETCH_ERROR, error: errorMessage});
    });
};

// for updating top-level settings
export const updateSettings = (settings) => {
  return {type: SETTINGS_UPDATED, settings};
};

// this is a nested property, so it needs a special action.
export const updateWordlist = (listName, list) => {
  return {type: WORDLIST_UPDATED, listName, list};
};

export const updateDomainlist = (listName, list) => {
  return {type: DOMAINLIST_UPDATED, listName, list};
};

export const saveSettingsToServer = () => (dispatch, getState, {rest}) => {
  let settings = getState().settings;
  if (settings.charCount) {
    settings.charCount = parseInt(settings.charCount);
  }
  dispatch({type: SAVE_SETTINGS_LOADING});
  rest('/settings', {method: 'PUT', body: settings})
    .then(() => {
      dispatch({type: SAVE_SETTINGS_SUCCESS, settings});
    })
    .catch((error) => {
      console.error(error);
      const errorMessage = error.translation_key ? t(`error.${error.translation_key}`) : error.toString();
      dispatch({type: SAVE_SETTINGS_FAILED, error: errorMessage});
    });
};
