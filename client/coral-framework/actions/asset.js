import * as actions from '../constants/asset';

export const fetchAssetRequest = () => ({type: actions.FETCH_ASSET_REQUEST});
export const fetchAssetSuccess = asset => ({type: actions.FETCH_ASSET_SUCCESS, asset});
export const fetchAssetFailure = error => ({type: actions.FETCH_ASSET_FAILURE, error});
