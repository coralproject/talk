import * as actions from '../constants/embed';

const initialState = {
  activeTab: 'stream',
};

export default function stream(state = initialState, action) {
  switch (action.type) {
  case actions.SET_ACTIVE_TAB:
    return {
      ...state,
      activeTab: action.tab,
    };
  default:
    return state;
  }
}
