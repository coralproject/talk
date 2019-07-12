import queryString from 'querystringify';

import {
  FETCH_ASSETS_REQUEST,
  FETCH_ASSETS_SUCCESS,
  FETCH_ASSETS_FAILURE,
  LOAD_MORE_ASSETS_REQUEST,
  LOAD_MORE_ASSETS_SUCCESS,
  LOAD_MORE_ASSETS_FAILURE,
  SET_PAGE,
  SET_SEARCH_VALUE,
  SET_CRITERIA,
  UPDATE_ASSET_STATE_REQUEST,
  UPDATE_ASSET_STATE_SUCCESS,
  UPDATE_ASSET_STATE_FAILURE,
} from '../constants/stories';

import t from 'coral-framework/services/i18n';

/**
 * Action disptacher related to assets
 */

// Fetch a page of assets
// Get comments to fill each of the three lists on the mod queue
export const fetchAssets = (query = {}) => (dispatch, _, { rest2 }) => {
  dispatch({ type: FETCH_ASSETS_REQUEST });
  return rest2(`/stories?${queryString.stringify(query)}`)
    .then(({ edges, pageInfo }) =>
      dispatch({
        type: FETCH_ASSETS_SUCCESS,
        edges,
        pageInfo,
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

export const loadMoreAssets = (query = {}) => (dispatch, _l, { rest2 }) => {
  dispatch({ type: LOAD_MORE_ASSETS_REQUEST });
  return rest2(`/stories?${queryString.stringify(query)}`)
    .then(({ edges, pageInfo }) =>
      dispatch({
        type: LOAD_MORE_ASSETS_SUCCESS,
        edges,
        pageInfo,
      })
    )
    .catch(error => {
      console.error(error);
      const errorMessage = error.translation_key
        ? t(`error.${error.translation_key}`)
        : error.toString();
      dispatch({ type: LOAD_MORE_ASSETS_FAILURE, error: errorMessage });
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
