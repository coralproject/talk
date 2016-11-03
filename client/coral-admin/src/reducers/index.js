
import { combineReducers } from 'redux'
import comments from 'reducers/comments'

// Combine all reducers into a main one
export default combineReducers({
  comments
})
