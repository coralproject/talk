import {TOGGLE_CHECKBOX} from './constants';

const initialState = {
  checked: false
};

export default function offTopic (state = initialState, action) {
  switch (action.type) {
    case TOGGLE_CHECKBOX: {
      return {
        ...state,
        checked: !state.checked
      }
    }
  default :
    return state;
  }
}
