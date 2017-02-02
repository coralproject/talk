import * as actions from '../actions/notification';
import {Map} from 'immutable';

const initialState = Map({
  text: '',
  type: '',
  position: 400
});

export default (state = initialState, action) => {
  switch (action.type) {
  case actions.ADD_NOTIFICATION:
    return state
      .merge({
        type: action.notifType,
        text: action.text,
        position: action.position
      });
  case actions.CLEAR_NOTIFICATION:
    return initialState;
  default:
    return state;
  }
};
