import * as actions from '../constants/asset';
import coralApi from '../helpers/response';
import {addNotification} from '../actions/notification';

import I18n from 'coral-i18n/modules/i18n/i18n';
const lang = new I18n();

export const fetchAssetRequest = () => ({type: actions.FETCH_ASSET_REQUEST});
export const fetchAssetSuccess = (asset) => ({type: actions.FETCH_ASSET_SUCCESS, asset});
export const fetchAssetFailure = (error) => ({type: actions.FETCH_ASSET_FAILURE, error});

const updateAssetSettingsRequest = () => ({type: actions.UPDATE_ASSET_SETTINGS_REQUEST});
const updateAssetSettingsSuccess = (settings) => ({type: actions.UPDATE_ASSET_SETTINGS_SUCCESS, settings});
const updateAssetSettingsFailure = () => ({type: actions.UPDATE_ASSET_SETTINGS_FAILURE});

export const updateConfiguration = (newConfig) => (dispatch, getState) => {
  const assetId = getState().asset.toJS().id;
  dispatch(updateAssetSettingsRequest());
  coralApi(`/assets/${assetId}/settings`, {method: 'PUT', body: newConfig})
    .then(() => {
      dispatch(addNotification('success', lang.t('framework.success_update_settings')));
      dispatch(updateAssetSettingsSuccess(newConfig));
    })
    .catch((error) => dispatch(updateAssetSettingsFailure(error)));
};

export const updateOpenStream = (closedBody) => (dispatch, getState) => {
  const assetId = getState().asset.toJS().id;
  dispatch(fetchAssetRequest());
  coralApi(`/assets/${assetId}/status`, {method: 'PUT', body: closedBody})
    .then(() => {
      dispatch(addNotification('success', lang.t('framework.success_update_settings')));
      dispatch(fetchAssetSuccess(closedBody));
    })
    .catch((error) => dispatch(fetchAssetFailure(error)));
};

const openStream = () => ({type: actions.OPEN_COMMENTS});
const closeStream = () => ({type: actions.CLOSE_COMMENTS});

export const updateOpenStatus = (status) => (dispatch) => {
  if (status === 'open') {
    dispatch(openStream());
    dispatch(updateOpenStream({closedAt: null}));
  } else {
    dispatch(closeStream());
    dispatch(updateOpenStream({closedAt: new Date().getTime()}));
  }
};
