import {Map} from 'immutable';
import * as actions from '../constants/asset';

const initialState = Map({
  closedAt: null,
  settings: null,
  title: null,
  url: null
});

export default function asset (state = initialState, action) {
  switch (action.type) {
  case actions.FETCH_ASSET_SUCCESS :
    return state
        .merge(action.asset);
  default :
    return state;
  }
}
