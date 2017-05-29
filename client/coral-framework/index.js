import pym from './services/PymConnection';
import actions from './actions';

// TODO (bc): Deprecate old actions. Spreading actions is now needed.

export default {
  pym,
  actions,
  ...actions
};
