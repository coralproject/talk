import * as actions from '../constants/auth';
import { setStorageAuthToken, clearStorageAuthToken } from '../services/auth';

export const checkLogin = () => (
  dispatch,
  _,
  { rest, client, pym, localStorage }
) => {
  dispatch(checkLoginRequest());
  rest('/auth')
    .then(result => {
      if (!result.user) {
        clearStorageAuthToken(localStorage);
        dispatch(checkLoginSuccess(null));
        client.resetWebsocket();
        return;
      }

      dispatch(checkLoginSuccess(result.user));
      pym.sendMessage('coral-auth-changed', JSON.stringify(result.user));

      // We don't need to reset the websocket here because if the request
      // returned that there was a user (which is the case here), then the
      // original request has already succeeded, or a previous call to a token
      // set handler has already reset it.
    })
    .catch(error => {
      if (error.status && error.status === 401 && localStorage) {
        // Unauthorized.
        clearStorageAuthToken(localStorage);
        client.resetWebsocket();
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

export const setAuthToken = token => (
  dispatch,
  _,
  { localStorage, client }
) => {
  setStorageAuthToken(localStorage, token);

  // Dispatch the set auth token action. For some browsers and situations, we
  // may not be able to persist the auth token any other way. Keep it in redux!
  dispatch({ type: actions.SET_AUTH_TOKEN, token });

  // Now that we set a token, let's reset the subscriptions.
  client.resetWebsocket();

  dispatch(checkLogin());
};

export const handleSuccessfulLogin = (user, token) => (
  dispatch,
  _,
  { client, localStorage, postMessage }
) => {
  setStorageAuthToken(localStorage, token);

  // Send the message via the messages service to the window.opener if it
  // exists.
  if (window.opener) {
    postMessage.post(
      actions.HANDLE_SUCCESSFUL_LOGIN,
      { user, token },
      window.opener
    );
  }

  // Now that we just set a token, set the token!
  client.resetWebsocket();

  dispatch({
    type: actions.HANDLE_SUCCESSFUL_LOGIN,
    user,
    token,
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
  try {
    await rest('/auth', { method: 'DELETE' });
  } catch (err) {
    // We ignore any REST related errors from the delete action, which may/may
    // not have had a cookie/token attached to it. The logout action was still
    // called, so we still want to cleanup.
  }

  // Clear the auth data persisted to localStorage.
  clearStorageAuthToken(localStorage);

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
