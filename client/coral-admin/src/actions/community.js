import {
  FETCHING_COMMENTERS,
  FETCHING_COMMENTERS_FAILURE,
  FETCHING_COMMENTERS_SUCCESS
} from '../constants/community'

export const fetchCommenters = ({ value = "", skip = 0, limit = 0 }) => ({
  type: FETCHING_COMMENTERS,
  payload: {
    value,
    skip,
    limit
  }
})
