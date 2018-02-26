import { MERGE_CONFIG } from '../constants/config';
import { LOGOUT } from '../constants/auth';

const initialState = {};

export default function config(state = initialState, action) {
  switch (action.type) {
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
