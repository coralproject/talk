import {Map} from 'immutable'

import {
  FETCH_COMMENTERS_REQUEST,
  FETCH_COMMENTERS_FAILURE,
  FETCH_COMMENTERS_SUCCESS
} from '../constants/community'

const initialCommunityState = Map({
  community: Map(),
  isFetching: false,
  error: '',
  commenters: []
})

export default function community (state = initialCommunityState, action) {
  switch (action.type) {
    case FETCH_COMMENTERS_REQUEST :
      return state
        .set('isFetching', true)
    case FETCH_COMMENTERS_FAILURE :
      return state
        .set('isFetching', false)
        .set('error', action.error)
    case FETCH_COMMENTERS_SUCCESS :
      return state
        .set('isFetching', false)
        .set('error', '')
        .set('commenters', action.commenters)
    default :
      return state
  }
}