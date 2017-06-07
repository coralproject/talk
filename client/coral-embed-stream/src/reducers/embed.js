import * as actions from '../constants/embed';

const initialState = {
  activeTab: 'stream',
  previousTab: '',
  refetching: false,
  refetchRequestId: 0,
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
        refetching: action.isRefetch ? true : state.refetching,
        refetchRequestId: action.isRefetch ? action.requestId : state.refetchRequestId,
      };
    }
    return state;
  case 'APOLLO_QUERY_RESULT':
    if (action.operationName === 'CoralEmbedStream_Embed') {
      return {
        ...state,
        refetching: action.requestId === state.refetchRequestId ? false : state.refetching,
      };
    }
    return state;
  default:
    return state;
  }
}
