import * as actions from 'constants/configure';

export const updatePending = ({ updater, errorUpdater }) => {
  return { type: actions.UPDATE_PENDING, updater, errorUpdater };
};

export const clearPending = () => {
  return { type: actions.CLEAR_PENDING };
};

export const setActiveSection = section => {
  return { type: actions.SET_ACTIVE_SECTION, section };
};
