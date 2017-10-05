import * as actions from 'constants/configure';

export const updatePending = ({updater, errorUpdater}) => {
  return {type: actions.UPDATE_PENDING, updater, errorUpdater};
};
