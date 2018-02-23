import * as actions from '../constants/profile';

const initialState = {
  activeTab: 'comments',
  previousTab: '',
};

export default function stream(state = initialState, action) {
  switch (action.type) {
    case actions.SET_ACTIVE_TAB:
      return {
        ...state,
        activeTab: action.tab,
        previousTab: state.activeTab,
      };
    default:
      return state;
  }
}
