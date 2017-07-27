import * as actions from '../constants/userDetail';

const initialState = {
  userDetailId: null,
  userDetailActiveTab: 'all',
  userDetailStatuses: ['NONE', 'ACCEPTED', 'REJECTED', 'PREMOD'],
  userDetailSelectedIds: [],
};

export default function banUserDialog(state = initialState, action) {
  switch (action.type) {
  case actions.VIEW_USER_DETAIL:
    return {
      ...state,
      userDetailId: action.userId,
    };
  case actions.HIDE_USER_DETAIL:
    return {
      ...state,
      userDetailId: null,
      userDetailSelectedIds: [],
    };
  case actions.CLEAR_USER_DETAIL_SELECTIONS:
    return {
      ...state,
      userDetailSelectedIds: [],
    };
  case actions.CHANGE_USER_DETAIL_STATUSES:
    return {
      ...state,
      userDetailActiveTab: action.tab,
      userDetailStatuses: action.statuses,
    };
  case actions.SELECT_USER_DETAIL_COMMENT:
    return {
      ...state,
      userDetailSelectedIds: [...state.userDetailSelectedIds, action.id],
    };
  case actions.UNSELECT_USER_DETAIL_COMMENT:
    return {
      ...state,
      userDetailSelectedIds: state.userDetailSelectedIds.filter((id) => id !== action.id),
    };
  default:
    return state;
  }
}
