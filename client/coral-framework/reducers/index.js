import auth from './auth';
import user from './user';
import asset from './asset';
import {reducersImporter} from '../helpers/plugins';

export default {
  auth,
  user,
  asset,
  ...reducersImporter
};
