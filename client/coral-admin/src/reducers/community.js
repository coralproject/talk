import {
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
  SORT_UPDATE,
  SET_PAGE,
  SET_SEARCH_VALUE,
  SHOW_BANUSER_DIALOG,
  HIDE_BANUSER_DIALOG,
  SHOW_REJECT_USERNAME_DIALOG,
  HIDE_REJECT_USERNAME_DIALOG,
  SET_INDICATOR_TRACK,
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
  rejectUsernameDialog: false,
  // If true the activity indicator will track flagged account changes
  // in order to determine the current queue count. Set this to false
  // if the queue count is determined by other means.
  indicatorTrack: true,
};

export default function community(state = initialState, action) {
  switch (action.type) {
    case FETCH_USERS_REQUEST:
      return {
        ...state,
        isFetchingPeople: true,
      };
    case FETCH_USERS_FAILURE:
      return {
        ...state,
        isFetchingPeople: false,
        errorPeople: action.error,
      };
    case FETCH_USERS_SUCCESS: {
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
    case SORT_UPDATE:
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
        rejectUsernameDialog: true,
      };
    case SET_SEARCH_VALUE:
      return {
        ...state,
        searchValue: action.value,
      };
    case SET_INDICATOR_TRACK:
      return {
        ...state,
        indicatorTrack: action.track,
      };
    default:
      return state;
  }
}
