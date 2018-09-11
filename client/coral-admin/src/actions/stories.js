import queryString from 'querystringify';

import {
  FETCH_ASSETS_REQUEST,
  FETCH_ASSETS_SUCCESS,
  FETCH_ASSETS_FAILURE,
  SET_PAGE,
  SET_SEARCH_VALUE,
  SET_CRITERIA,
  UPDATE_ASSET_STATE_REQUEST,
  UPDATE_ASSET_STATE_SUCCESS,
  UPDATE_ASSET_STATE_FAILURE,
  UPDATE_ASSETS,
} from '../constants/stories';

import t from 'coral-framework/services/i18n';

/**
 * Action disptacher related to assets
 */

// Fetch a page of assets
// Get comments to fill each of the three lists on the mod queue
export const fetchAssets = (query = {}) => (dispatch, _, { rest }) => {
  dispatch({ type: FETCH_ASSETS_REQUEST });
  return rest(`/assets?${queryString.stringify(query)}`)
    .then(({ result, page, count, limit, totalPages }) =>
      dispatch({
        type: FETCH_ASSETS_SUCCESS,
        assets: result,
        page,
        count,
        limit,
        totalPages,
      })
    )
    .catch(error => {
      console.error(error);
      const errorMessage = error.translation_key
        ? t(`error.${error.translation_key}`)
        : error.toString();
      dispatch({ type: FETCH_ASSETS_FAILURE, error: errorMessage });
    });
};

// Update an asset state
// Get comments to fill each of the three lists on the mod queue
export const updateAssetState = (id, closedAt) => (dispatch, _, { rest }) => {
  dispatch({ type: UPDATE_ASSET_STATE_REQUEST, id, closedAt });
  return rest(`/assets/${id}/status`, { method: 'PUT', body: { closedAt } })
    .then(() => dispatch({ type: UPDATE_ASSET_STATE_SUCCESS }))
    .catch(error => {
      console.error(error);
      const errorMessage = error.translation_key
        ? t(`error.${error.translation_key}`)
        : error.toString();
      dispatch({ type: UPDATE_ASSET_STATE_FAILURE, error: errorMessage });
    });
};

export const updateAssets = assets => dispatch => {
  dispatch({ type: UPDATE_ASSETS, assets });
};

export const setPage = page => ({
  type: SET_PAGE,
  page,
});

export const setSearchValue = value => ({
  type: SET_SEARCH_VALUE,
  value,
});

export const setCriteria = criteria => ({
  type: SET_CRITERIA,
  criteria,
});
