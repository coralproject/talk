import {
  MERGE_CONFIG,
  ENABLE_PLUGINS_DEBUG,
  DISABLE_PLUGINS_DEBUG,
} from '../constants/config';
import { LOGOUT } from '../constants/auth';

const initialState = {};

export default function config(state = initialState, action) {
  switch (action.type) {
    case ENABLE_PLUGINS_DEBUG:
      return {
        ...state,
        plugins_config: {
          ...state.plugins_config,
          debug: true,
        },
      };
    case DISABLE_PLUGINS_DEBUG:
      return {
        ...state,
        plugins_config: {
          ...state.plugins_config,
          debug: false,
        },
      };
    case LOGOUT:
      return {
        ...state,
        auth_token: null,
      };
    case MERGE_CONFIG:
      return {
        ...state,
        ...action.config,
      };
    default:
      return state;
  }
}
