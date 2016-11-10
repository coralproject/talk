import {
  FETCH_COMMENTERS_REQUEST,
  FETCH_COMMENTERS_SUCCESS,
  FETCH_COMMENTERS_FAILURE
} from '../constants/community'

export const fetchCommenters = (query = {}) => ({
  type: FETCH_COMMENTERS_REQUEST,
  query
})
