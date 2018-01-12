import merge from 'lodash/merge';

const buildOptions = (inputOptions = {}) => {
  const defaultOptions = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin',
  };

  const options = merge({}, defaultOptions, inputOptions);
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
      error.status = res.status;
      throw error;
    });
  } else if (res.status === 204) {
    return res.text();
  } else {
    return res.json();
  }
};

/**
 * createRestClient setups and returns a Rest Client
 * @param  {Object}          options            configuration
 * @param  {string}          options.uri        uri of the rest server
 * @param  {string|function} [options.token]    auth token
 * @return {Object}          rest client
 */
export function createRestClient(options) {
  const { token, uri } = options;
  const client = (path, options) => {
    const authToken = typeof token === 'function' ? token() : token;
    let opts = options;
    if (authToken) {
      opts = merge({}, options, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
    }
    return fetch(`${uri}${path}`, buildOptions(opts)).then(handleResp);
  };
  client.uri = uri;
  return client;
}
