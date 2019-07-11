import * as actions from '../constants/stories';
import update from 'immutability-helper';

const initialState = {
  assets: {
    edges: [],
    pageInfo: {},
  },
  searchValue: '',
  criteria: {
    filter: 'all',
  },
};

export default function assets(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_ASSETS_SUCCESS: {
      return update(state, {
        assets: {
          edges: { $set: action.edges },
          pageInfo: { $set: action.pageInfo },
        },
      });
    }
    case actions.LOAD_MORE_ASSETS_SUCCESS: {
      return update(state, {
        assets: {
          edges: { $push: action.edges },
          pageInfo: {
            endCursor: { $set: action.pageInfo.endCursor },
            hasNextPage: { $set: action.pageInfo.hasNextPage },
          },
        },
      });
    }
    case actions.UPDATE_ASSET_STATE_REQUEST:
      return update(state, {
        assets: {
          byId: {
            [action.id]: {
              closedAt: { $set: action.closedAt },
            },
          },
        },
      });
    case actions.SET_SEARCH_VALUE:
      return {
        ...state,
        searchValue: action.value,
      };
    case actions.SET_CRITERIA:
      return {
        ...state,
        criteria: {
          ...state.criteria,
          ...action.criteria,
        },
      };
    default:
      return state;
  }
}
