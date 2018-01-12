import * as actions from '../constants/auth';

const initialState = {
  loggedIn: false,
  user: null,
  loginError: null,
  loginMaxExceeded: false,
  passwordRequestSuccess: null,
};

export default function auth(state = initialState, action) {
  switch (action.type) {
    case actions.CHECK_LOGIN_REQUEST:
      return {
        ...state,
        loadingUser: true,
      };
    case actions.CHECK_LOGIN_FAILURE:
      return {
        ...state,
        loggedIn: false,
        loadingUser: false,
        user: null,
      };
    case actions.CHECK_LOGIN_SUCCESS:
      return {
        ...state,
        loggedIn: true,
        loadingUser: false,
        user: action.user,
      };
    case actions.LOGOUT:
      return initialState;
    case actions.LOGIN_SUCCESS:
      return {
        ...state,
        loginMaxExceeded: false,
        loginError: null,
      };
    case actions.LOGIN_FAILURE:
      return {
        ...state,
        loginError: action.message,
      };
    case actions.FETCH_FORGOT_PASSWORD_REQUEST:
      return {
        ...state,
        passwordRequestSuccess: null,
      };
    case actions.FETCH_FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        passwordRequestSuccess:
          'If you have a registered account, a password reset link was sent to that email.',
      };
    case actions.LOGIN_MAXIMUM_EXCEEDED:
      return {
        ...state,
        loginMaxExceeded: true,
        loginError: action.message,
      };
    default:
      return state;
  }
}
