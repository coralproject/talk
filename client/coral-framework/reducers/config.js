import { MERGE_CONFIG } from '../constants/config';

const initialState = {};

export default function config(state = initialState, action) {
  switch (action.type) {
    case MERGE_CONFIG:
      return {
        ...state,
        ...action.config,
      };
    default:
      return state;
  }
}
