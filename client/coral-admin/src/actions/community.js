import {
  FETCHING_COMMENTERS,
  FETCHING_COMMENTERS_FAILURE,
  FETCHING_COMMENTERS_SUCCESS
} from '../constants/community'

export const startFetchCommenters = () => ({ type: FETCHING_COMMENTERS })
