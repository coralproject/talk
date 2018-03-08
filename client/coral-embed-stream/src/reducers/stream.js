import * as actions from '../constants/stream';
import * as authActions from 'coral-framework/constants/auth';

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
  assetId: getQueryVariable('asset_id') || '',
  assetUrl: getQueryVariable('asset_url') || '',
  commentId: getQueryVariable('comment_id') || '',
  commentClassNames: [],
  activeTab: process.env.TALK_DEFAULT_STREAM_TAB,
  previousTab: '',
  sortBy: 'CREATED_AT',
  sortOrder: 'DESC',
  commentBoxTags: [],
};

export default function stream(state = initialState, action) {
  switch (action.type) {
    case actions.SET_ACTIVE_TAB:
      return {
        ...state,
        activeTab: action.tab,
        previousTab: state.activeTab,
      };
    case authActions.LOGOUT:
      return {
        ...state,
        activeReplyBox: '',
      };
    case actions.SET_ACTIVE_REPLY_BOX:
      return {
        ...state,
        activeReplyBox: action.id,
      };
    case actions.VIEW_ALL_COMMENTS:
      return {
        ...state,
        commentId: '',
      };
    case actions.VIEW_COMMENT:
      return {
        ...state,
        commentId: action.id,
      };
    case actions.ADD_COMMENT_CLASSNAME:
      return {
        ...state,
        commentClassNames: [...state.commentClassNames, action.className],
      };
    case actions.REMOVE_COMMENT_CLASSNAME:
      return {
        ...state,
        commentClassNames: [
          ...state.commentClassNames.slice(0, action.idx),
          ...state.commentClassNames.slice(action.idx + 1),
        ],
      };
    case actions.SET_SORT:
      return {
        ...state,
        sortOrder: action.sortOrder ? action.sortOrder : state.sortOrder,
        sortBy: action.sortBy ? action.sortBy : state.sortBy,
      };
    case actions.ADD_COMMENT_BOX_TAG:
      return {
        ...state,
        commentBoxTags: [...state.commentBoxTags, action.tag],
      };
    case actions.REMOVE_COMMENT_BOX_TAG:
      return {
        ...state,
        commentBoxTags: [
          ...state.commentBoxTags.slice(0, action.idx),
          ...state.commentBoxTags.slice(action.idx + 1),
        ],
      };
    case actions.CLEAR_COMMENT_BOX_TAGS:
      return {
        ...state,
        commentBoxTags: [],
      };
    default:
      return state;
  }
}
