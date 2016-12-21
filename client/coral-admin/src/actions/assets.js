import {
  FETCH_ASSETS_REQUEST,
  FETCH_ASSETS_SUCCESS,
  FETCH_ASSETS_FAILURE,
  UPDATE_ASSET_STATE_REQUEST,
  UPDATE_ASSET_STATE_SUCCESS,
  UPDATE_ASSET_STATE_FAILURE
} from '../constants/assets';
import coralApi from '../../../coral-framework/helpers/response';

/**
 * Action disptacher related to assets
 */

// Fetch a page of assets
// Get comments to fill each of the three lists on the mod queue
export const fetchAssets = (skip = '', limit = '', search = '', sort = '', filter = '') => (dispatch) => {
  dispatch({type: FETCH_ASSETS_REQUEST});
  return coralApi(`/assets?skip=${skip}&limit=${limit}&sort=${sort}&search=${search}&filter=${filter}`)
  .then(({result, count}) =>
    dispatch({type: FETCH_ASSETS_SUCCESS,
      assets: result,
      count
    }))
    .catch(error => dispatch({type: FETCH_ASSETS_FAILURE, error}));
};

// Update an asset state
// Get comments to fill each of the three lists on the mod queue
export const updateAssetState = (id, closedAt) => (dispatch) => {
  dispatch({type: UPDATE_ASSET_STATE_REQUEST});
  return coralApi(`/assets/${id}/status`, {method: 'PUT', body: {closedAt}})
  .then(() =>
    dispatch({type: UPDATE_ASSET_STATE_SUCCESS}))
    .catch(error => dispatch({type: UPDATE_ASSET_STATE_FAILURE, error}));
};
