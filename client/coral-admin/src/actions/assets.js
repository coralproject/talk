import {
  FETCH_ASSETS_REQUEST,
  FETCH_ASSETS_SUCCESS,
  FETCH_ASSETS_FAILURE,
  UPDATE_ASSET_STATE_REQUEST,
  UPDATE_ASSET_STATE_SUCCESS,
  UPDATE_ASSET_STATE_FAILURE,
  UPDATE_ASSETS
} from '../constants/assets';

import t from 'coral-framework/services/i18n';

/**
 * Action disptacher related to assets
 */

// Fetch a page of assets
// Get comments to fill each of the three lists on the mod queue
export const fetchAssets = (skip = '', limit = '', search = '', sort = '', filter = '') => (dispatch, _, {rest}) => {
  dispatch({type: FETCH_ASSETS_REQUEST});
  return rest(`/assets?skip=${skip}&limit=${limit}&sort=${sort}&search=${search}&filter=${filter}`)
    .then(({result, count}) =>
      dispatch({type: FETCH_ASSETS_SUCCESS,
        assets: result,
        count
      }))
    .catch((error) => {
      console.error(error);
      const errorMessage = error.translation_key ? t(`error.${error.translation_key}`) : error.toString();
      dispatch({type: FETCH_ASSETS_FAILURE, error: errorMessage});
    });
};

// Update an asset state
// Get comments to fill each of the three lists on the mod queue
export const updateAssetState = (id, closedAt) => (dispatch, _, {rest}) => {
  dispatch({type: UPDATE_ASSET_STATE_REQUEST, id, closedAt});
  return rest(`/assets/${id}/status`, {method: 'PUT', body: {closedAt}})
    .then(() => dispatch({type: UPDATE_ASSET_STATE_SUCCESS}))
    .catch((error) => {
      console.error(error);
      const errorMessage = error.translation_key ? t(`error.${error.translation_key}`) : error.toString();
      dispatch({type: UPDATE_ASSET_STATE_FAILURE, error: errorMessage});
    });
};

export const updateAssets = (assets) => (dispatch) => {
  dispatch({type: UPDATE_ASSETS, assets});
};
