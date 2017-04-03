import * as authActions from './auth';
import * as assetActions from './asset';
import * as notificationActions from './notification';
import {getPluginActions} from '../helpers/plugins';

export default {
  authActions,
  assetActions,
  notificationActions,
  pluginActions: getPluginActions(),
};
