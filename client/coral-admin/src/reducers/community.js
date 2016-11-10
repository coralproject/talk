import {
  FETCH_COMMENTERS_REQUEST,
  FETCH_COMMENTERS_FAILURE,
  FETCH_COMMENTERS_SUCCESS
} from '../constants/community'

const initialCommunityState = {
  isFetching: false,
  error: '',
  commenters: []
}

export default function community (state = initialCommunityState, action) {
  switch (action.type) {
    case FETCH_COMMENTERS_REQUEST :
      return {
        ...state,
        isFetching: true
      }
    case FETCH_COMMENTERS_FAILURE :
      return {
        ...state,
        isFetching: false,
        error: action.error
      }
    case FETCH_COMMENTERS_SUCCESS :
      return {
        ...state,
        isFetching: false,
        error: '',
        commenters: action.commenters
      }
    default :
      return state
  }
}