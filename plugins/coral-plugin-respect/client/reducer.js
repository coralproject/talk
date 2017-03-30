import {Map} from 'immutable';

const initialState = Map({
  clicked: false
});

export function respect (state = initialState, action) {
  switch (action.type) {
  default:
    return state;
  }
}
