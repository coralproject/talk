/* @flow */

import {combineReducers} from 'redux';
import config from './config';
import items from './items';
import notification from './notification';
import auth from './auth';
import embedStream from './embedStream';

/**
 * Expose the combined main reducer
 */

export default combineReducers({
  config,
  items,
  notification,
  auth,
  embedStream
});
