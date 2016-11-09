import {
  FETCHING_COMMENTERS,
  FETCHING_COMMENTERS_FAILURE,
  FETCHING_COMMENTERS_SUCCESS
} from '../constants/community'

const initialCommunityState = {
  isFetching: false,
  error: '',
  commenters: []
}

export default function community (state = initialCommunityState, action) {
  switch (action.type) {
    case FETCHING_COMMENTERS :
      return {
        ...state,
        isFetching: true
      }
    case FETCHING_COMMENTERS_FAILURE :
      return {
        ...state,
        isFetching: false,
        error: action.payload.error
      }
    case FETCHING_COMMENTERS_SUCCESS :
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