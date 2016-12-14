import coralApi from '../helpers/response';
import {addItem} from './items';

export const MULTIPLE_ASSETS_REQUEST = 'MULTIPLE_ASSETS_REQUEST';
export const MULTIPLE_ASSETS_SUCCESS = 'MULTIPLE_ASSETS_SUCCESS';
export const MULTIPLE_ASSSETS_FAILURE = 'MULTIPLE_ASSSETS_FAILURE';

export const fetchMulitpleAssets = ids => {
  return dispatch => {
    dispatch({type: MULTIPLE_ASSETS_REQUEST});

    coralApi(`/assets/multi?ids=${encodeURIComponent(ids.join(','))}`)
      .then(assets => {
        assets.forEach(asset => dispatch(addItem(asset, 'assets')));
        dispatch({type: MULTIPLE_ASSETS_SUCCESS, assets: assets.map(asset => asset.id)});
      })
      .catch(error => dispatch({type: MULTIPLE_ASSSETS_FAILURE, error}));
  };
};
