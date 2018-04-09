import * as actions from '../constants/auth';
import merge from 'lodash/merge';

const initialState = {
  checkedInitialLogin: false,
  initialLoginError: null,
  user: null,
  token: null,
};

const purge = user => {
  const {settings, ...userData} = user; // eslint-disable-line
  return userData;
};

export default function auth(state = initialState, action) {
  switch (action.type) {
    case actions.SET_AUTH_TOKEN:
      return {
        ...state,
        token: action.token || null,
      };
    case actions.CHECK_LOGIN_FAILURE:
      return {
        ...state,
        initialLoginError: action.error,
        checkedInitialLogin: true,
        user: null,
        token: null,
      };
    case actions.CHECK_LOGIN_SUCCESS:
      return {
        ...state,
        checkedInitialLogin: true,
        user: action.user ? purge(action.user) : null,
      };
    case actions.HANDLE_SUCCESSFUL_LOGIN:
      return {
        ...state,
        user: action.user ? purge(action.user) : null,
        token: action.token || null,
      };
    case actions.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
      };
    case actions.UPDATE_STATUS: {
      return {
        ...state,
        user: {
          ...state.user,
          status: merge({}, state.user.status, action.status),
        },
      };
    }
    case actions.UPDATE_USERNAME:
      return {
        ...state,
        user: {
          ...state.user,
          username: action.username,
          lowercaseUsername: action.username.toLowerCase(),
        },
      };
    default:
      return state;
  }
}
