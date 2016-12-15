import {FETCH_ASSETS, UPDATE_ASSET} from '../constants/assets';

/**
 * Action disptacher related to assets
 */

export const updateAsset = (id, property, value) => (dispatch) => {
  dispatch({type: UPDATE_ASSET, id, property, value});
};

export const fetchAssets = (skip, limit, search, sort) => (dispatch) => {
  dispatch({type: FETCH_ASSETS, skip, limit, search, sort});
};
