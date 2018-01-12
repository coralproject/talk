import {
  OPEN_MENU,
  CLOSE_MENU,
  OPEN_BAN_DIALOG,
  CLOSE_BAN_DIALOG,
} from './constants';

const initialState = {
  showMenuForComment: null,
  showBanDialog: false,
  authorId: null,
  commentId: null,
  commentStatus: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case OPEN_MENU:
      return {
        ...state,
        showMenuForComment: action.id,
      };
    case CLOSE_MENU:
      return {
        ...state,
        showMenuForComment: null,
      };
    case OPEN_BAN_DIALOG:
      return {
        ...state,
        showBanDialog: true,
        authorId: action.authorId,
        commentId: action.commentId,
        commentStatus: action.commentStatus,
      };
    case CLOSE_BAN_DIALOG:
      return {
        ...state,
        showBanDialog: false,
        authorId: null,
        commentId: null,
        commentStatus: null,
      };
    default:
      return state;
  }
}
