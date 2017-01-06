export const base = '/api/v1';

const buildOptions = (inputOptions = {}) => {

  const csurfDOM = document.head.querySelector('[property=csrf]');

  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'same-origin',
    _csrf: csurfDOM ? csurfDOM.content : false
  };

  const options = Object.assign({}, defaultOptions, inputOptions);

  if (options._csrf) {
    switch (options.method.toLowerCase()) {
    case 'post':
    case 'put':
    case 'delete':
      options.headers['x-csrf-token'] = options._csrf;
      break;
    }
  }

  if (options.method.toLowerCase() !== 'get') {
    options.body = JSON.stringify(options.body);
  }

  return options;
};

const handleResp = res => {
  if (res.status === 401) {
    throw new Error('Not Authorized to make this request');
  } else if (res.status > 399) {
    return res.json().then(err => {
      console.log(err);
      let message = err.message || res.status;
      if (err.error && err.error.translation_key) {
        message = err.error.translation_key;
      }
      throw new Error(message);
    });
  } else if (res.status === 204) {
    return res.text();
  } else {
    return res.json();
  }
};

export default (url, options) => {
  return fetch(`${base}${url}`, buildOptions(options)).then(handleResp);
};
