export const base = '/api/v1';

const buildOptions = (inputOptions = {}) => {

  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'same-origin'
  };
  const options = Object.assign({}, defaultOptions, inputOptions);

  // Add CSRF field to each POST.
  if (options.method.toLowerCase() === 'post' && options._csrf) {
    options.body._csrf = options._csrf;
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
      throw new Error(err.message || res.status);
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
