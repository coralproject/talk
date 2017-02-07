import * as actions from 'constants/moderation';

export const setActiveTab = activeTab => ({type: actions.SET_ACTIVE_TAB, activeTab});
export const toggleModal = open => ({type: actions.TOGGLE_MODAL, open});
export const singleView = () => ({type: actions.SINGLE_VIEW});
