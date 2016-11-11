import {Map} from 'immutable';

import {
  FETCH_COMMENTERS_REQUEST,
  FETCH_COMMENTERS_FAILURE,
  FETCH_COMMENTERS_SUCCESS,
  SORT_UPDATE
} from '../constants/community';

const initialState = Map({
  community: Map(),
  isFetching: false,
  error: '',
  commenters: [],
  field: 'created_at',
  asc: false,
  totalPages: 0,
  page: 0
});

export default function community (state = initialState, action) {
  switch (action.type) {
  case FETCH_COMMENTERS_REQUEST :
    return state
      .set('isFetching', true);
  case FETCH_COMMENTERS_FAILURE :
    return state
      .set('isFetching', false)
      .set('error', action.error);
  case FETCH_COMMENTERS_SUCCESS :
    return state
      .set('isFetching', false)
      .set('error', '')
      .set('commenters', action.commenters)
      .set('limit', action.limit)
      .set('page', action.page)
      .set('totalPages', action.totalPages)
      .set('count', action.count);
  case SORT_UPDATE :
    return state
      .set('field', action.sort.field)
      .set('asc', !state.get('asc'));
  default :
    return state;
  }
}
