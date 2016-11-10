import { combineReducers } from 'redux'
import comments from 'reducers/comments'
import community from 'reducers/community'

// Combine all reducers into a main one
export default combineReducers({
  comments,
  community
})
