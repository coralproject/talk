import store from './services/store';
import pym from './services/PymConnection';
import I18n from './modules/i18n/i18n';
import * as authActions from './actions/auth';
import * as assetActions from './actions/asset';
import * as notificationActions from './actions/notification';
import Slot from './components/Slot';

const context = require.context('plugins', true, /\.\/(.*)\/client\/actions.js$/);
const pluginsActions = context
  .keys()
  .reduce(entry, key => entry[key] = context(key), {});

export {
  pym,
  Slot,
  I18n,
  store,
  authActions,
  assetActions,
  notificationActions,
  pluginsActions
};
