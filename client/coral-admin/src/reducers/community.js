import {Map} from 'immutable';

import {
  FETCH_COMMENTERS_REQUEST,
  FETCH_COMMENTERS_FAILURE,
  FETCH_COMMENTERS_SUCCESS,
  SORT_UPDATE,
  SET_ROLE,
  SET_COMMENTER_STATUS
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
  case FETCH_COMMENTERS_SUCCESS : {
    const {commenters, type, ...rest} = action; // eslint-disable-line
    return state
      .merge({
        isFetching: false,
        error: '',
        ...rest
      })
      .set('commenters', commenters); // Sets to normal array
  }
  case SET_ROLE : {
    const commenters = state.get('commenters');
    const idx = commenters.findIndex(el => el.id === action.id);

    commenters[idx].roles[0] = action.role;
    return state.set('commenters', commenters.map(id => id));
  }
  case SET_COMMENTER_STATUS: {
    const commenters = state.get('commenters');
    const idx = commenters.findIndex(el => el.id === action.id);

    commenters[idx].status = action.status;
    return state.set('commenters', commenters.map(id => id));

  }
  case SORT_UPDATE :
    return state
      .set('field', action.sort.field)
      .set('asc', !state.get('asc'));
  default :
    return state;
  }
}
