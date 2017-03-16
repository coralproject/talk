import {Map} from 'immutable';

import * as actions from '../actions/pageData';

const initialState = Map({
  data: Map({})
});

export default function pageData (state = initialState, action) {
  switch (action.type) {
  case actions.PAGE_DATA_UPDATED:
    return state.set('data', Map(action.data));
  default:
    return state;
  }
}
