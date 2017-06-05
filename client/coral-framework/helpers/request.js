import bowser from 'bowser';
import * as Storage from './storage';
import merge from 'lodash/merge';
import {getStore} from 'coral-framework/services/store';

/**
 * getAuthToken returns the active auth token or null
 *   Note: this method does not have access to the cookie based token used by
 *   browsers that don't allow us to use cross domain iframe local storage.
 * @return {string|null}
 */
export const getAuthToken = () => {
  let state = getStore().getState();

  if (state.config.auth_token) {

    // if an auth_token exists in config, use it.
    return state.config.auth_token;

  } else if (!bowser.safari && !bowser.ios) {

    // Use local storage auth tokens where there's a stable api.
    return Storage.getItem('token');
  }

  return null;
};

const buildOptions = (inputOptions = {}) => {
  const defaultOptions = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin'
  };

  let options = merge({}, defaultOptions, inputOptions);

  // Apply authToken header
  let authToken = getAuthToken();
  if (authToken) {
    options.headers.Authorization = `Bearer ${authToken}`;
  }

  if (options.method.toLowerCase() !== 'get') {
    options.body = JSON.stringify(options.body);
  }

  return options;
};

const handleResp = (res) => {
  if (res.status > 399) {
    return res.json().then((err) => {
      let message = err.message || res.status;
      const error = new Error();

      if (err.error && err.error.metadata && err.error.metadata.message) {
        error.metadata = err.error.metadata.message;
      }

      if (err.error && err.error.translation_key) {
        error.translation_key = err.error.translation_key;
      }

      error.message = message;
      throw error;
    });
  } else if (res.status === 204) {
    return res.text();
  } else {
    return res.json();
  }
};

export const base = '/api/v1';

export default (url, options) => {
  return fetch(`${base}${url}`, buildOptions(options)).then(handleResp);
};
