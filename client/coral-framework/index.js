import pym from './services/PymConnection';
import I18n from './modules/i18n/i18n';
import actions from './actions';

// TODO (bc): Deprecate old actions. Spreading actions is now needed.

export default {
  pym,
  I18n,
  actions,
  ...actions
};
