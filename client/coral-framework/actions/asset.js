import * as actions from '../constants/asset';
import coralApi from '../helpers/response';
import {addNotification} from '../actions/notification';

import I18n from 'coral-framework/modules/i18n/i18n';
import translations from './../translations';
const lang = new I18n(translations);

export const fetchAssetRequest = () => ({type: actions.FETCH_ASSET_REQUEST});
export const fetchAssetSuccess = asset => ({type: actions.FETCH_ASSET_SUCCESS, asset});
export const fetchAssetFailure = error => ({type: actions.FETCH_ASSET_FAILURE, error});

const updateConfigRequest = () => ({type: actions.UPDATE_CONFIG_REQUEST});
const updateConfigSuccess = config => ({type: actions.UPDATE_CONFIG_SUCCESS, config});
const updateConfigFailure = () => ({type: actions.UPDATE_CONFIG_FAILURE});

export const updateConfiguration = newConfig => (dispatch, getState) => {
  const assetId = getState().asset.toJS().id;
  dispatch(updateConfigRequest());
  coralApi(`/assets/${assetId}/settings`, {method: 'PUT', body: newConfig})
    .then(() => {
      dispatch(addNotification('success', lang.t('successUpdateSettings')));
      dispatch(updateConfigSuccess(newConfig));
    })
    .catch(error => dispatch(updateConfigFailure(error)));
};

export const updateOpenStream = closedBody => (dispatch, getState) => {
  const assetId = getState().asset.toJS().id;
  dispatch(updateConfigRequest());
  coralApi(`/assets/${assetId}/status`, {method: 'PUT', body: closedBody})
    .then(() => {
      dispatch(addNotification('success', lang.t('successUpdateSettings')));
      dispatch(updateConfigSuccess(closedBody));
    })
    .catch(error => dispatch(updateConfigFailure(error)));
};

const openStream = () => ({type: actions.OPEN_COMMENTS});
const closeStream = () => ({type: actions.CLOSE_COMMENTS});

export const updateOpenStatus = status => dispatch => {
  if (status === 'open') {
    dispatch(openStream());
    dispatch(updateOpenStream({closedAt: null}));
  } else {
    dispatch(closeStream());
    dispatch(updateOpenStream({closedAt: new Date().getTime()}));
  }
};
