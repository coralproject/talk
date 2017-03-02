import {Map} from 'immutable';

import {
  FETCH_COMMENTERS_REQUEST,
  FETCH_COMMENTERS_FAILURE,
  FETCH_COMMENTERS_SUCCESS,
  SORT_UPDATE,
  SET_ROLE,
  SET_COMMENTER_STATUS,
  SHOW_BANUSER_DIALOG,
  HIDE_BANUSER_DIALOG,
  SHOW_SUSPENDUSER_DIALOG,
  HIDE_SUSPENDUSER_DIALOG
} from '../constants/community';

const initialState = Map({
  community: Map(),
  isFetchingPeople: false,
  errorPeople: '',
  accounts: [],
  fieldPeople: 'created_at',
  ascPeople: false,
  totalPagesPeople: 0,
  pagePeople: 0,
  user: Map({}),
  banDialog: false,
  suspendDialog: false
});

export default function community (state = initialState, action) {
  switch (action.type) {
  case FETCH_COMMENTERS_REQUEST :
    return state
      .set('isFetchingPeople', true);
  case FETCH_COMMENTERS_FAILURE :
    return state
      .set('isFetchingPeople', false)
      .set('errorPeople', action.error);

  case FETCH_COMMENTERS_SUCCESS : {
    const {accounts, type, page, count, limit, totalPages, ...rest} = action; // eslint-disable-line
    return state
      .merge({
        isFetchingPeople: false,
        errorPeople: '',
        pagePeople: page,
        countPeople: count,
        limitPeople: limit,
        totalPagesPeople: totalPages,
        ...rest
      })
      .set('accounts', accounts); // Sets to normal array
  }
  case SET_ROLE : {
    const commenters = state.get('accounts');
    const idx = commenters.findIndex(el => el.id === action.id);

    commenters[idx].roles[0] = action.role;
    return state.set('accounts', commenters.map(id => id));
  }
  case SET_COMMENTER_STATUS: {
    const commenters = state.get('accounts');
    const idx = commenters.findIndex(el => el.id === action.id);

    commenters[idx].status = action.status;
    return state.set('accounts', commenters.map(id => id));

  }
  case SORT_UPDATE :
    return state
      .set('fieldPeople', action.sort.field)
      .set('ascPeople', !state.get('ascPeople'));
  case HIDE_BANUSER_DIALOG:
    return state
      .set('banDialog', false);
  case SHOW_BANUSER_DIALOG:
    return state
      .merge({
        user: Map(action.user),
        banDialog: true
      });
  case HIDE_SUSPENDUSER_DIALOG:
    return state
      .set('suspendDialog', false);
  case SHOW_SUSPENDUSER_DIALOG:
    return state
      .merge({
        user: Map(action.user),
        suspendDialog: true
      });
  default :
    return state;
  }
}
