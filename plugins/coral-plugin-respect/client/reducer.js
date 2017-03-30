import {Map} from 'immutable';

const initialState = Map({
  clicked: false
});

export function respect (state = initialState, action) {
  switch (action.type) {
  case 'BUTTON_CLICKED' :
    return state
      .set('clicked', !state.get('clicked'));
  default:
    return state;
  }
}
