import * as actions from '../actions/config';

const initialState = {
  data: {},
};

export default function config(state = initialState, action) {
  switch (action.type) {
    case actions.CONFIG_UPDATED:
      return {
        ...state,
        data: action.data,
      };
    default:
      return state;
  }
}
