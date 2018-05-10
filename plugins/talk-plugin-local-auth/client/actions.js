import * as actions from './constants';

export const startAttach = () => ({
  type: actions.STARTED_ATTACH,
});

export const finishAttach = () => ({
  type: actions.FINISH_ATTACH,
});
