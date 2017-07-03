import {OFFTOPIC_TOGGLE_CHECKBOX, OFFTOPIC_TOGGLE_STATE} from './constants';

const initialState = {
  checked: false,
  offTopicState: 'shown',
  offTopicTipDisplayed: false
};

export default function offTopic (state = initialState, action) {
  switch (action.type) {
  case OFFTOPIC_TOGGLE_CHECKBOX: {
    return {
      ...state,
      checked: !state.checked
    };
  }
  case OFFTOPIC_TOGGLE_STATE: {
    return {
      ...state,
      offTopicState: (state.offTopicState === 'shown') ? 'hiding' : 'shown'
    };
  }
  default :
    return state;
  }
}
