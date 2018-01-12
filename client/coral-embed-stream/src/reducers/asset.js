import * as actions from '../constants/asset';

const initialState = {
  closedAt: null,
  settings: null,
  title: null,
  url: null,
  features: {},
  status: 'open',
  moderation: null,
};

export default function asset(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_ASSET_SUCCESS:
      return {
        ...state,
        ...action.asset,
      };
    case actions.UPDATE_ASSET_SETTINGS_SUCCESS:
      return {
        ...state,
        settings: action.settings,
      };
    default:
      return state;
  }
}
