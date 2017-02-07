import {combineReducers} from 'redux';

import auth from './auth';
import users from './users';
import assets from './assets';
import actions from './actions';
import comments from './comments';
import settings from './settings';
import community from './community';
import moderation from './moderation';

export default combineReducers({
  auth,
  users,
  assets,
  actions,
  settings,
  comments,
  community,
  moderation
});
