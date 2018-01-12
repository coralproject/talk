import * as actions from '../constants/stream';
import { buildUrl } from 'coral-framework/utils/url';
import queryString from 'query-string';

export const setActiveReplyBox = id => ({
  type: actions.SET_ACTIVE_REPLY_BOX,
  id,
});

export const setSort = ({ sortOrder, sortBy }) => ({
  type: actions.SET_SORT,
  sortOrder,
  sortBy,
});

export const viewAllComments = () => (dispatch, _, { pym }) => {
  const search = queryString.stringify({
    ...queryString.parse(location.search),
    comment_id: undefined,
  });

  // remove the comment_id url param
  const url = buildUrl({ ...location, search });

  try {
    // "window" here refers to the embedded iframe
    window.history.replaceState({}, document.title, url);

    // also change the parent url
    pym.sendMessage('coral-view-all-comments');
  } catch (e) {
    /* not sure if we're worried about old browsers */
  }

  dispatch({ type: actions.VIEW_ALL_COMMENTS });
};

export const viewComment = id => (dispatch, _, { pym }) => {
  const search = queryString.stringify({
    ...queryString.parse(location.search),
    comment_id: id,
  });

  // remove the comment_id url param
  const url = buildUrl({ ...location, search });

  try {
    // "window" here refers to the embedded iframe
    window.history.replaceState({}, document.title, url);

    // also change the parent url
    pym.sendMessage('coral-view-comment', id);
  } catch (e) {
    /* not sure if we're worried about old browsers */
  }

  dispatch({ type: actions.VIEW_COMMENT, id });
};

export const addCommentClassName = className => ({
  type: actions.ADD_COMMENT_CLASSNAME,
  className,
});

export const removeCommentClassName = idx => ({
  type: actions.REMOVE_COMMENT_CLASSNAME,
  idx,
});

export const setActiveTab = tab => dispatch => {
  dispatch({ type: actions.SET_ACTIVE_TAB, tab });
};
