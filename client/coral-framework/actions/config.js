import coralApi from '../helpers/response';
/* Config Actions */

/**
 * Action name constants
 */

export const UPDATE_SETTINGS = 'UPDATE_SETTINGS';
export const OPEN_COMMENTS = 'OPEN_COMMENTS';
export const CLOSE_COMMENTS = 'CLOSE_COMMENTS';
export const ADD_ITEM = 'ADD_ITEM';

export const updateOpenStatus = status => (dispatch, getState) => {
  const assetId = getState().items.get('assets')
    .keySeq()
    .toArray()[0];
  return coralApi(`/asset/${assetId}/status?status=${status}`, {method: 'PUT'})
    .then(() => dispatch({type: status === 'open' ? OPEN_COMMENTS : CLOSE_COMMENTS}));
};
