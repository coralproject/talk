
import {combineReducers} from 'redux';
import comments from 'reducers/comments';
import settings from 'reducers/settings';

// Combine all reducers into a main one
export default combineReducers({
  settings,
  comments
});
