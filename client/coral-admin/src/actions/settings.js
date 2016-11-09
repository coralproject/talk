export const SETTINGS_LOADING = 'SETTINGS_LOADING';
export const SETTINGS_RECEIVED = 'SETTINGS_RECEIVED';
export const SETTINGS_FETCH_ERROR = 'SETTINGS_FETCH_ERROR';

export const SETTINGS_UPDATED = 'SETTINGS_UPDATED';

export const SAVE_SETTINGS_LOADING = 'SAVE_SETTINGS_LOADING';
export const SAVE_SETTINGS_SUCCESS = 'SAVE_SETTINGS_SUCCESS';
export const SAVE_SETTINGS_FAILED = 'SAVE_SETTINGS_FAILED';

const base = '/api/v1';

const getInit = (method, body) => {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  const init = {method, headers};
  if (method.toLowerCase() !== 'get') {
    init.body = JSON.stringify(body);
  }

  return init;
};

const handleResp = res => {
  if (res.status === 401) {
    throw new Error('Not Authorized to make this request');
  } else if (res.status > 399) {
    throw new Error('Error! Status ' + res.status);
  } else if (res.status === 204) {
    return res.text();
  } else {
    return res.json();
  }
};

export const fetchSettings = () => dispatch => {
  dispatch({type: SETTINGS_LOADING});
  fetch(`${base}/settings`, getInit('GET'))
    .then(handleResp)
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
  const settings = getState().settings.toJS().settings;
  dispatch({type: SAVE_SETTINGS_LOADING});
  fetch(`${base}/settings`, getInit('PUT', settings))
    .then(handleResp)
    .then(() => {
      dispatch({type: SAVE_SETTINGS_SUCCESS, settings});
    })
    .catch(error => {
      dispatch({type: SAVE_SETTINGS_FAILED, error});
    });
};
