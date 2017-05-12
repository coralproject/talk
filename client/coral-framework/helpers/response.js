import * as Storage from './storage';

const buildOptions = (inputOptions = {}) => {
  const defaultOptions = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${Storage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin'
  };

  let options = Object.assign({}, defaultOptions, inputOptions);
  options.headers = Object.assign(
    {},
    defaultOptions.headers,
    inputOptions.headers
  );

  if (options.method.toLowerCase() !== 'get') {
    options.body = JSON.stringify(options.body);
  }

  return options;
};

const handleResp = res => {
  if (res.status > 399) {
    return res.json().then(err => {
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
