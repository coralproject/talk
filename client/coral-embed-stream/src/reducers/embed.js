import * as actions from '../constants/embed';

const initialState = {
  activeTab: 'stream',
  previousTab: '',
  refetching: false,
};

export default function stream(state = initialState, action) {
  switch (action.type) {
  case actions.SET_ACTIVE_TAB:
    return {
      ...state,
      activeTab: action.tab,
      previousTab: state.activeTab,
    };
  case 'APOLLO_QUERY_INIT':
    if (action.queryString.indexOf('query CoralEmbedStream_Embed(') >= 0) {
      return {
        ...state,
        refetching: action.isRefetch,
      };
    }
    return state;
  case 'APOLLO_QUERY_RESULT':
    if (action.operationName === 'CoralEmbedStream_Embed') {
      return {
        ...state,
        refetching: false,
      };
    }
    return state;
  default:
    return state;
  }
}
