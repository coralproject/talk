import * as actions from '../constants/asset';
import coralApi from '../helpers/response';
import {addNotification} from '../actions/notification';
import {pym} from 'coral-framework';

import I18n from 'coral-i18n/modules/i18n/i18n';
import translations from './../translations';
const lang = new I18n(translations);

export const fetchAssetRequest = () => ({type: actions.FETCH_ASSET_REQUEST});
export const fetchAssetSuccess = asset => ({type: actions.FETCH_ASSET_SUCCESS, asset});
export const fetchAssetFailure = error => ({type: actions.FETCH_ASSET_FAILURE, error});

const updateAssetSettingsRequest = () => ({type: actions.UPDATE_ASSET_SETTINGS_REQUEST});
const updateAssetSettingsSuccess = settings => ({type: actions.UPDATE_ASSET_SETTINGS_SUCCESS, settings});
const updateAssetSettingsFailure = () => ({type: actions.UPDATE_ASSET_SETTINGS_FAILURE});

export const updateConfiguration = newConfig => (dispatch, getState) => {
  const assetId = getState().asset.toJS().id;
  dispatch(updateAssetSettingsRequest());
  coralApi(`/assets/${assetId}/settings`, {method: 'PUT', body: newConfig})
    .then(() => {
      dispatch(addNotification('success', lang.t('successUpdateSettings')));
      dispatch(updateAssetSettingsSuccess(newConfig));
    })
    .catch(error => dispatch(updateAssetSettingsFailure(error)));
};

export const updateOpenStream = closedBody => (dispatch, getState) => {
  const assetId = getState().asset.toJS().id;
  dispatch(fetchAssetRequest());
  coralApi(`/assets/${assetId}/status`, {method: 'PUT', body: closedBody})
    .then(() => {
      dispatch(addNotification('success', lang.t('successUpdateSettings')));
      dispatch(fetchAssetSuccess(closedBody));
    })
    .catch(error => dispatch(fetchAssetFailure(error)));
};

const openStream = () => ({type: actions.OPEN_COMMENTS});
const closeStream = () => ({type: actions.CLOSE_COMMENTS});
export const updateCountCache = (id, count) => ({type: actions.UPDATE_COUNT_CACHE, id, count});

export const updateOpenStatus = status => dispatch => {
  if (status === 'open') {
    dispatch(openStream());
    dispatch(updateOpenStream({closedAt: null}));
  } else {
    dispatch(closeStream());
    dispatch(updateOpenStream({closedAt: new Date().getTime()}));
  }
};

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
