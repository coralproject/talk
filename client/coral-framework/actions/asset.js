import * as actions from '../constants/asset';
import coralApi from '../helpers/request';
import {addNotification} from '../actions/notification';

import t from 'coral-framework/services/i18n';

export const fetchAssetRequest = () => ({type: actions.FETCH_ASSET_REQUEST});
export const fetchAssetSuccess = (asset) => ({type: actions.FETCH_ASSET_SUCCESS, asset});
export const fetchAssetFailure = (error) => ({type: actions.FETCH_ASSET_FAILURE, error});

const updateAssetSettingsRequest = () => ({type: actions.UPDATE_ASSET_SETTINGS_REQUEST});
const updateAssetSettingsSuccess = (settings) => ({type: actions.UPDATE_ASSET_SETTINGS_SUCCESS, settings});
const updateAssetSettingsFailure = (error) => ({type: actions.UPDATE_ASSET_SETTINGS_FAILURE, error});

export const updateConfiguration = (newConfig) => (dispatch, getState) => {
  const assetId = getState().asset.toJS().id;
  dispatch(updateAssetSettingsRequest());
  coralApi(`/assets/${assetId}/settings`, {method: 'PUT', body: newConfig})
    .then(() => {
      dispatch(addNotification('success', t('framework.success_update_settings')));
      dispatch(updateAssetSettingsSuccess(newConfig));
    })
    .catch((error) => {
      console.error(error);
      dispatch(updateAssetSettingsFailure(error));
    });
};

export const updateOpenStream = (closedBody) => (dispatch, getState) => {
  const assetId = getState().asset.toJS().id;
  dispatch(fetchAssetRequest());
  coralApi(`/assets/${assetId}/status`, {method: 'PUT', body: closedBody})
    .then(() => {
      dispatch(addNotification('success', t('framework.success_update_settings')));
      dispatch(fetchAssetSuccess(closedBody));
    })
    .catch((error) => {
      console.error(error);
      dispatch(fetchAssetFailure(error));
    });
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
