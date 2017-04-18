import * as actions from '../constants/stream';

export const setActiveReplyBox = (id) => ({type: actions.SET_ACTIVE_REPLY_BOX, id});
export const setCommentCountCache = (amount) => ({type: actions.SET_COMMENT_COUNT_CACHE, amount});
