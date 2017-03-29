import {Map} from 'immutable';

const initialState = Map({
  clicked: false
});

export default function reducer (state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
