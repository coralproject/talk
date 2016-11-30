import {Map} from 'immutable';
import {FETCH_SIGNIN_SUCCESS} from '../constants/auth';
import * as actions from '../constants/user';

const initialState = Map({
  bio: ''
});

export default function user (state = initialState, action) {
  switch (action.type) {
  case FETCH_SIGNIN_SUCCESS :
    return state
      .set('bio', action.user.bio);
  case actions.SAVE_BIO_SUCCESS :
    return state
      .set('bio', action.bio);
  default :
    return state;
  }
}
