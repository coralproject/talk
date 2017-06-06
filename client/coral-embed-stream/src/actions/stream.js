import {pym} from 'coral-framework';
import * as actions from '../constants/stream';

export const setActiveReplyBox = (id) => ({type: actions.SET_ACTIVE_REPLY_BOX, id});
export const setCommentCountCache = (amount) => ({type: actions.SET_COMMENT_COUNT_CACHE, amount});

function removeParam(key, sourceURL) {
  let rtn = sourceURL.split('?')[0];
  let param;
  let params_arr = [];
  let queryString = (sourceURL.indexOf('?') !== -1) ? sourceURL.split('?')[1] : '';
  if (queryString !== '') {
    params_arr = queryString.split('&');
    for (let i = params_arr.length - 1; i >= 0; i -= 1) {
      param = params_arr[i].split('=')[0];
      if (param === key) {
        params_arr.splice(i, 1);
      }
    }
    rtn = `${rtn}?${params_arr.join('&')}`;
  }
  return rtn;
}

export const viewAllComments = () => {

  // remove the comment_id url param
  const modifiedUrl = removeParam('comment_id', location.href);

  try {

    // "window" here refers to the embedded iframe
    window.history.replaceState({}, document.title, modifiedUrl);

    // also change the parent url
    pym.sendMessage('coral-view-all-comments');
  } catch (e) { /* not sure if we're worried about old browsers */ }

  return {type: actions.VIEW_ALL_COMMENTS};
};

export const openViewingOptions = () => ({
  type: actions.OPEN_VIEWING_OPTIONS
});

export const closeViewingOptions = () => ({
  type: actions.CLOSE_VIEWING_OPTIONS
});
