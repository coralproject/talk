import {Map} from 'immutable';

import * as actions from '../constants/install';

const initialState = Map({
  step: 0
});

export default function auth (state = initialState, action) {
  switch (action.type) {
  case actions.NEXT_STEP:
    console.log(state)
    return state
      .set('step', state.get('step') + 1);
  case actions.PREVIOUS_STEP:
    return state
      .set('step', state.get('step') - 1);
  default :
    return state;
  }
}
