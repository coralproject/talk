import * as actions from './constants';
import * as views from './enums/views';

const initialState = {
  view: views.SIGN_IN,
  email: '',
  password: '',
  enableSubmit: true,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.ENABLE_SUBMIT:
      return {
        ...state,
        enableSubmit: true,
      };
    case actions.DISABLE_SUBMIT:
      return {
        ...state,
        enableSubmit: false,
      };
    case actions.SET_VIEW:
      return {
        ...state,
        view: action.view,
      };
    case actions.SET_EMAIL:
      return {
        ...state,
        email: action.email,
      };
    case actions.SET_PASSWORD:
      return {
        ...state,
        password: action.password,
      };
    default:
      return state;
  }
}
