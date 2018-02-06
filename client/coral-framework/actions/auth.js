import * as actions from '../constants/auth';
import jwtDecode from 'jwt-decode';

function cleanAuthData(storage) {
  storage.removeItem('token');
  storage.removeItem('exp');
}

/**
 * Check Login
 */
export const checkLogin = () => (
  dispatch,
  _,
  { rest, client, pym, storage }
) => {
  dispatch(checkLoginRequest());
  rest('/auth')
    .then(result => {
      if (!result.user) {
        if (storage) {
          cleanAuthData(storage);
        }
        dispatch(checkLoginSuccess(null));
        return;
      }

      // Reset the websocket.
      client.resetWebsocket();

      dispatch(checkLoginSuccess(result.user));
      pym.sendMessage('coral-auth-changed', JSON.stringify(result.user));
    })
    .catch(error => {
      if (error.status && error.status === 401 && storage) {
        // Unauthorized.
        cleanAuthData(storage);
      } else {
        console.error(error);
      }
      dispatch(checkLoginFailure(error));
    });
};

const checkLoginRequest = () => ({ type: actions.CHECK_LOGIN_REQUEST });

const checkLoginFailure = error => ({
  type: actions.CHECK_LOGIN_FAILURE,
  error,
});

const checkLoginSuccess = user => ({
  type: actions.CHECK_LOGIN_SUCCESS,
  user,
});

/**
 * Login
 */
export const handleSuccessfulLogin = (user, token) => (
  dispatch,
  _,
  { client, storage }
) => {
  if (storage) {
    storage.setItem('exp', jwtDecode(token).exp);
    storage.setItem('token', token);
  }

  client.resetWebsocket();

  dispatch({
    type: actions.HANDLE_SUCCESSFUL_LOGIN,
    user,
  });
};

/**
 * Logout
 */
export const logout = () => async (
  dispatch,
  _,
  { rest, client, pym, storage }
) => {
  await rest('/auth', { method: 'DELETE' });

  if (storage) {
    cleanAuthData(storage);
  }

  // Reset the websocket.
  client.resetWebsocket();

  dispatch({ type: actions.LOGOUT });
  pym.sendMessage('coral-auth-changed');
};
