import * as actions from 'constants/userDetail';

export const viewUserDetail = userId => ({
  type: actions.VIEW_USER_DETAIL,
  userId,
});
export const hideUserDetail = () => ({ type: actions.HIDE_USER_DETAIL });

export const changeTab = tab => {
  let statuses = null;
  if (tab === 'rejected') {
    statuses = ['REJECTED'];
  }
  return { type: actions.CHANGE_TAB_USER_DETAIL, tab, statuses };
};

export const clearUserDetailSelections = () => ({
  type: actions.CLEAR_USER_DETAIL_SELECTIONS,
});

export const toggleSelectCommentInUserDetail = (id, active) => {
  return {
    type: active
      ? actions.SELECT_USER_DETAIL_COMMENT
      : actions.UNSELECT_USER_DETAIL_COMMENT,
    id,
  };
};

export const toggleSelectAllCommentInUserDetail = (ids, active) => {
  return {
    type: active
      ? actions.SELECT_ALL_USER_DETAIL_COMMENT
      : actions.CLEAR_USER_DETAIL_SELECTIONS,
    ids,
  };
};
