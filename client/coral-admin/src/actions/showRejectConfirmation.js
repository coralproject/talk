import {SHOW_REJECT_CONFIRMATION, HIDE_REJECT_CONFIRMATION} from '../constants/showRejectConfirmation';

export const showRejectConfirmation = (commentId) =>
  ({type: SHOW_REJECT_CONFIRMATION, commentId});

export const hideRejectConfirmation = () => ({type: HIDE_REJECT_CONFIRMATION});
