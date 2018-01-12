import { OPEN_MENU, CLOSE_MENU } from './constants';

const initialState = {
  open: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case OPEN_MENU:
      return {
        ...state,
        open: true,
      };
    case CLOSE_MENU:
      return {
        ...state,
        open: false,
      };
    default:
      return state;
  }
}
