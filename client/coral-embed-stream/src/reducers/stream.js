import * as actions from '../constants/stream';

function getQueryVariable(variable) {
  let query = window.location.search.substring(1);
  let vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) === variable) {
      return decodeURIComponent(pair[1]);
    }
  }

  // If not found, return null.
  return null;
}

const initialState = {
  activeReplyBox: '',
  commentCountCache: -1,
  assetId: getQueryVariable('asset_id'),
  assetUrl: getQueryVariable('asset_url'),
  commentId: getQueryVariable('comment_id'),
  commentClassNames: []
};

export default function stream(state = initialState, action) {
  switch (action.type) {
  case actions.SET_ACTIVE_REPLY_BOX:
    return {
      ...state,
      activeReplyBox: action.id,
    };
  case actions.SET_COMMENT_COUNT_CACHE:
    return {
      ...state,
      commentCountCache: action.amount,
    };
  case actions.VIEW_ALL_COMMENTS:
    return {
      ...state,
      commentId: '',
    };
  case actions.ADD_COMMENT_CLASSNAME :
    return {
      ...state,
      commentClassNames: [...state.commentClassNames, action.className]
    };
  case actions.REMOVE_COMMENT_CLASSNAME :
    return {
      ...state,
      commentClassNames: [
        ...state.commentClassNames.slice(0, action.idx),
        ...state.commentClassNames.slice(action.idx + 1)
      ]
    };
  default:
    return state;
  }
}
