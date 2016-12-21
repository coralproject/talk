import {
  FETCH_ASSETS,
  FETCH_ASSETS_SUCCESS,
  FETCH_ASSETS_FAILED,
  UPDATE_ASSET_STATE,
  UPDATE_ASSET_STATE_SUCCESS,
  UPDATE_ASSET_STATE_FAILED
} from '../constants/assets';
import coralApi from '../../../coral-framework/helpers/response';

/**
 * Action disptacher related to assets
 */

// Fetch a page of assets
// Get comments to fill each of the three lists on the mod queue
export const fetchAssets = (skip, limit, search, sort, filter) => (dispatch) => {
  dispatch({type: FETCH_ASSETS});
  return coralApi(`/assets?skip=${skip || ''}&limit=${limit || ''}&sort=${sort || ''}&search=${search || ''}&filter=${filter || ''}`)
  .then(({result, count}) =>
    dispatch({type: FETCH_ASSETS_SUCCESS,
      assets: result,
      count
    }))
    .catch(error => dispatch({type: FETCH_ASSETS_FAILED, error}));
};

// Update an asset state
// Get comments to fill each of the three lists on the mod queue
export const updateAssetState = (id, closedAt) => (dispatch) => {
  dispatch({type: UPDATE_ASSET_STATE});
  return coralApi(`/assets/${id}/status`, {method: 'PUT', body: {closedAt}})
  .then(() =>
    dispatch({type: UPDATE_ASSET_STATE_SUCCESS}))
    .catch(error => dispatch({type: UPDATE_ASSET_STATE_FAILED, error}));
};
