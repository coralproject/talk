import * as actions from '../constants/stories';
import update from 'immutability-helper';

const initialState = {
  byId: {},
  ids: [],
  assets: []
};

export default function assets (state = initialState, action) {
  switch (action.type) {
  case actions.FETCH_ASSETS_SUCCESS: {
    const assets = action.assets.reduce((prev, curr) => {
      prev[curr.id] = curr;
      return prev;
    }, {});

    return update(state, {
      totalPages: {$set: action.totalPages},
      page: {$set: action.page},
      byId: {$set: assets},
      count: {$set: action.count},
      ids: {$set: Object.keys(assets)},
    });
  }
  case actions.UPDATE_ASSET_STATE_REQUEST:
    return update(state, {
      byId: {
        [action.id]: {
          closedAt: {$set: action.closedAt},
        },
      },
    });
  case actions.UPDATE_ASSETS:
    return update(state, {
      assets: {$set: action.assets},
    });
  case actions.SET_PAGE:
    return {
      ...state,
      page: action.page,
    };
  default:
    return state;
  }
}

