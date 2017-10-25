import {
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
  SORT_UPDATE,
  SET_PAGE,
  SET_SEARCH_VALUE,
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
  users: [],
  searchValue: '',
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
  case FETCH_USERS_REQUEST :
    return {
      ...state,
      isFetchingPeople: true,
    };
  case FETCH_USERS_FAILURE :
    return {
      ...state,
      isFetchingPeople: false,
      errorPeople: action.error,
    };
  case FETCH_USERS_SUCCESS : {
    const {users, type, page, count, limit, totalPages, ...rest} = action; // eslint-disable-line
    return {
      ...state,
      isFetchingPeople: false,
      errorPeople: '',
      pagePeople: page,
      countPeople: count,
      limitPeople: limit,
      totalPagesPeople: totalPages,
      ...rest,
      users, // Sets to normal array
    };
  }
  case SET_PAGE:
    return {
      ...state,
      pagePeople: action.page,
    };
  case SET_ROLE : {
    const commenters = state.users;
    const idx = commenters.findIndex((el) => el.id === action.id);

    commenters[idx].roles[0] = action.role;
    return {
      ...state,
      users: commenters.map((id) => id),
    };
  }
  case SET_COMMENTER_STATUS: {
    const commenters = state.users;
    const idx = commenters.findIndex((el) => el.id === action.id);

    commenters[idx].status = action.status;
    return {
      ...state,
      users: commenters.map((id) => id),
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
  case SET_SEARCH_VALUE:
    return {
      ...state,
      searchValue: action.value,
    };
  default :
    return state;
  }
}
