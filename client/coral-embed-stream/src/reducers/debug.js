import * as actions from '../constants/debug';

const initialState = {
  plugins: false,
};

export default function DEBUG(state = initialState, action) {
  switch (action.type) {
    case actions.ENABLE_PLUGINS_DEBUG:
      return {
        plugins: true,
      };
    case actions.DISABLE_PLUGINS_DEBUG:
      return {
        plugins: false,
      };
    default:
      return state;
  }
}
