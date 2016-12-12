import {combineReducers} from 'redux';
import comments from 'reducers/comments';
import settings from 'reducers/settings';
import community from 'reducers/community';
import users from 'reducers/users';
import auth from 'reducers/auth';

// Combine all reducers into a main one
export default combineReducers({
  settings,
  comments,
  community,
  auth,
  users
});
