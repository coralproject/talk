import {combineReducers} from 'redux';
import config from './config';
import items from './items';
import notification from './notification';
import auth from './auth';
import user from './user';

export default {
  config,
  items,
  notification,
  auth,
  user
};
