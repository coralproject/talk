import {
  FETCH_COMMENTERS_REQUEST,
  FETCH_COMMENTERS_FAILURE,
  FETCH_COMMENTERS_SUCCESS,
  SORT_UPDATE,
  SET_ROLE,
  SET_COMMENTER_STATUS,
  SHOW_BANUSER_DIALOG,
  HIDE_BANUSER_DIALOG,
  SHOW_REJECT_USERNAME_DIALOG,
  HIDE_REJECT_USERNAME_DIALOG
} from '../constants/community';

const initialState = {
  community: {},
  isFetchingPeople: false,
  errorPeople: '',
  accounts: [],
  fieldPeople: 'created_at',
  ascPeople: false,
  totalPagesPeople: 0,
  pagePeople: 0,
  user: {},
  banDialog: false,
  rejectUsernameDialog: false
};

export default function community (state = initialState, action) {
  switch (action.type) {
  case FETCH_COMMENTERS_REQUEST :
    return {
      ...state,
      isFetchingPeople: true,
    };
  case FETCH_COMMENTERS_FAILURE :
    return {
      ...state,
      isFetchingPeople: false,
      errorPeople: action.error,
    };
  case FETCH_COMMENTERS_SUCCESS : {
    const {accounts, type, page, count, limit, totalPages, ...rest} = action; // eslint-disable-line
    return {
      ...state,
      isFetchingPeople: false,
      errorPeople: '',
      pagePeople: page,
      countPeople: count,
      limitPeople: limit,
      totalPagesPeople: totalPages,
      ...rest,
      accounts, // Sets to normal array
    };
  }
  case SET_ROLE : {
    const commenters = state.accounts;
    const idx = commenters.findIndex((el) => el.id === action.id);

    commenters[idx].roles[0] = action.role;
    return {
      ...state,
      accounts: commenters.map((id) => id),
    };
  }
  case SET_COMMENTER_STATUS: {
    const commenters = state.accounts;
    const idx = commenters.findIndex((el) => el.id === action.id);

    commenters[idx].status = action.status;
    return {
      ...state,
      accounts: commenters.map((id) => id),
    };

  }
  case SORT_UPDATE :
    return {
      ...state,
      fieldPeople: action.sort.field,
      ascPeople: !state.ascPeople,
    };
  case HIDE_BANUSER_DIALOG:
    return {
      ...state,
      banDialog: false,
    };
  case SHOW_BANUSER_DIALOG:
    return {
      ...state,
      user: action.user,
      banDialog: true,
    };
  case HIDE_REJECT_USERNAME_DIALOG:
    return {
      ...state,
      rejectUsernameDialog: false,
    };
  case SHOW_REJECT_USERNAME_DIALOG:
    return {
      ...state,
      user: action.user,
      rejectUsernameDialog: true
    };
  default :
    return state;
  }
}
