import jwtDecode from 'jwt-decode';

export const setStorageAuthToken = (storage, token) => {
  storage.setItem('exp', jwtDecode(token).exp);
  storage.setItem('token', token);
};

export const clearStorageAuthToken = storage => {
  storage.removeItem('token');
  storage.removeItem('exp');
};
