import * as actions from '../constants/static';

const initialState = {};

export default function auth(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATIC_CONFIGURATION:
      return {
        ...state,
        ...action.config,
      };
    default:
      return state;
  }
}
