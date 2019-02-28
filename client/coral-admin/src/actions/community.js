import queryString from 'querystringify';

import {
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
  SORT_UPDATE,
  SET_PAGE,
  SET_SEARCH_VALUE,
  SHOW_BANUSER_DIALOG,
  HIDE_BANUSER_DIALOG,
  SHOW_ALWAYS_PREMOD_USER_DIALOG,
  HIDE_ALWAYS_PREMOD_USER_DIALOG,
  SHOW_REJECT_USERNAME_DIALOG,
  HIDE_REJECT_USERNAME_DIALOG,
  SET_INDICATOR_TRACK,
} from '../constants/community';

import t from 'coral-framework/services/i18n';

export const fetchUsers = (query = {}) => (dispatch, _, { rest }) => {
  dispatch(requestFetchUsers());
  rest(`/users?${queryString.stringify(query)}`)
    .then(({ result, page, count, limit, totalPages }) => {
      dispatch({
        type: FETCH_USERS_SUCCESS,
        users: result,
        page,
        count,
        limit,
        totalPages,
      });
    })
    .catch(error => {
      console.error(error);
      const errorMessage = error.translation_key
        ? t(`error.${error.translation_key}`)
        : error.toString();
      dispatch({ type: FETCH_USERS_FAILURE, error: errorMessage });
    });
};

const requestFetchUsers = () => ({
  type: FETCH_USERS_REQUEST,
});

export const updateSorting = sort => ({
  type: SORT_UPDATE,
  sort,
});

export const setPage = page => ({
  type: SET_PAGE,
  page,
});

export const setSearchValue = value => ({
  type: SET_SEARCH_VALUE,
  value,
});

// Ban User Dialog
export const showBanUserDialog = user => ({ type: SHOW_BANUSER_DIALOG, user });
export const hideBanUserDialog = () => ({ type: HIDE_BANUSER_DIALOG });

// Always premod User Dialog
export const showAlwaysPremodUserDialog = user => ({
  type: SHOW_ALWAYS_PREMOD_USER_DIALOG,
  user,
});
export const hideAlwaysPremodUserDialog = () => ({
  type: HIDE_ALWAYS_PREMOD_USER_DIALOG,
});

// Reject Username Dialog
export const showRejectUsernameDialog = user => ({
  type: SHOW_REJECT_USERNAME_DIALOG,
  user,
});
export const hideRejectUsernameDialog = () => ({
  type: HIDE_REJECT_USERNAME_DIALOG,
});

// Enable or disable the activity indicator subscriptions.
export const setIndicatorTrack = track => ({
  type: SET_INDICATOR_TRACK,
  track,
});
