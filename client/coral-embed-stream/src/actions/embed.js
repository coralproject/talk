import * as actions from '../constants/embed';
import { viewAllComments } from './stream';

export const setActiveTab = tab => (dispatch, getState) => {
  dispatch({ type: actions.SET_ACTIVE_TAB, tab });
  if (getState().stream.commentId) {
    dispatch(viewAllComments());
  }
};
