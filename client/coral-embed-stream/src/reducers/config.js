import { ADD_EXTERNAL_CONFIG } from '../constants/config';

const initialState = {};

export default function config(state = initialState, action) {
  switch (action.type) {
    case ADD_EXTERNAL_CONFIG:
      return {
        ...state,
        ...action.config,
      };
    default:
      return state;
  }
}
