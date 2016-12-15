import {FETCH_ASSETS, UPDATE_ASSET_STATE} from '../constants/assets';

/**
 * Action disptacher related to assets
 */

export const updateAssetState = (id, closedAt) => (dispatch) => {
  dispatch({type: UPDATE_ASSET_STATE, id, closedAt});
};

export const fetchAssets = (skip, limit, search, sort) => (dispatch) => {
  dispatch({type: FETCH_ASSETS, skip, limit, search, sort});
};
