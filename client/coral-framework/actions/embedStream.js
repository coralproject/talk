import * as actions from '../constants/embedStream';

export const changeTab = view => dispatch =>
  dispatch({
    type: actions.CHANGE_TAB,
    view
  });
