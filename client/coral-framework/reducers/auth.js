import {Map} from 'immutable';
//
//import {
//  FETCH_COMMENTERS_REQUEST,
//  FETCH_COMMENTERS_FAILURE,
//  FETCH_COMMENTERS_SUCCESS,
//  SORT_UPDATE
//} from '../constants/community';
//
const initialState = Map({
  auth: Map(),
  loggedIn: false,
  error: '',
  user: {}
});

export default function community (state = initialState, action) {
  switch (action.type) {
  default :
    return state;
  }
}
