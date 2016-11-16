export const base = '/api/v1';

export const getInit = (method, body) => {
  let init = {
    method,
    headers: new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }),
    credentials: 'same-origin'
  };

  if (method.toLowerCase() !== 'get') {
    init.body = JSON.stringify(body);
  }

  return init;
};

export const handleResp = res => {
  if (res.status === 401) {
    throw new Error('Not Authorized to make this request');
  } else if (res.status === 500) {
    throw new Error(res.json());
  } else if (res.status > 399) {
    throw new Error('Error! Status ', res.status);
  } else if (res.status === 204) {
    return res.text();
  } else {
    return res.json();
  }
};
