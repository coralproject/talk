import store from './services/store';
import pym from './services/PymConnection';
import I18n from './modules/i18n/i18n';
import actions from './actions';
import Slot from './components/Slot';

export default {
  pym,
  Slot,
  I18n,
  store,
  actions,
  ...actions
};
