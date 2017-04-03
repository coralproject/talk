import auth from './auth';
import user from './user';
import asset from './asset';
import {getPluginReducers} from '../helpers/plugins';

export default {
  auth,
  user,
  asset,
  ...getPluginReducers()
};
