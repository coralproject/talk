import pym from './services/PymConnection';
import actions from './actions';
import {loadTranslations} from '../coral-i18n/services/i18n';

// TODO (bc): Deprecate old actions. Spreading actions is now needed.

loadTranslations();

export default {
  pym,
  actions,
  ...actions
};
