import * as actions from './constants';

const initialState = {
  showAddEmailDialog: true,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.SHOW_ADD_EMAIL_DIALOG:
      return {
        ...state,
        showAddEmailDialog: true,
      };
    case actions.HIDE_ADD_EMAIL_DIALOG:
      return {
        ...state,
        showAddEmailDialog: false,
      };
    default:
      return state;
  }
}
