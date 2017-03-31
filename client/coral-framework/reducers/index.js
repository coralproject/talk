import auth from './auth';
import user from './user';
import asset from './asset';
import {reducers as pluginReducers} from '../helpers/plugins';

export default {
  auth,
  user,
  asset,
  ...pluginReducers
};
