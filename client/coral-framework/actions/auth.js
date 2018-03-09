import * as actions from '../constants/auth';
import jwtDecode from 'jwt-decode';

function cleanAuthData(localStorage) {
  localStorage.removeItem('token');
  localStorage.removeItem('exp');
}

export const checkLogin = () => (
  dispatch,
  _,
  { rest, client, pym, localStorage }
) => {
  dispatch(checkLoginRequest());
  rest('/auth')
    .then(result => {
      if (!result.user) {
        if (localStorage) {
          cleanAuthData(localStorage);
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
      if (error.status && error.status === 401 && localStorage) {
        // Unauthorized.
        cleanAuthData(localStorage);
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

export const setAuthToken = token => (dispatch, _, { localStorage }) => {
  if (localStorage) {
    localStorage.setItem('exp', jwtDecode(token).exp);
    localStorage.setItem('token', token);
  }

  dispatch(checkLogin());
};

export const handleSuccessfulLogin = (user, token) => (
  dispatch,
  _,
  { client, localStorage, postMessage }
) => {
  const { exp } = jwtDecode(token);

  if (localStorage) {
    localStorage.setItem('exp', exp);
    localStorage.setItem('token', token);
  }

  // Send the message via the messages service to the window.opener if it
  // exists.
  if (window.opener) {
    postMessage.post(
      actions.HANDLE_SUCCESSFUL_LOGIN,
      { user, token },
      window.opener
    );
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
  { rest, client, pym, localStorage }
) => {
  await rest('/auth', { method: 'DELETE' });

  if (localStorage) {
    cleanAuthData(localStorage);
  }

  // Reset the websocket.
  client.resetWebsocket();

  dispatch({ type: actions.LOGOUT });
  pym.sendMessage('coral-auth-changed');
};

export const updateStatus = status => ({
  type: actions.UPDATE_STATUS,
  status,
});

export const updateUsername = username => ({
  type: actions.UPDATE_USERNAME,
  username,
});
