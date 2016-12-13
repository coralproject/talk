import coralApi from '../helpers/response';
import {addItem} from './items';

export const FETCH_MULTIPLE_ASSETS = 'FETCH_MULTIPLE_ASSETS';
export const RECEIVE_MULTIPLE_ASSETS = 'RECEIVE_MULTIPLE_ASSETS';
export const FAILURE_MULTIPLE_ASSSETS = 'FAILURE_MULTIPLE_ASSSETS';

export const fetchMulitpleAssets = ids => {
  return dispatch => {
    dispatch({type: FETCH_MULTIPLE_ASSETS});

    coralApi(`/assets/multi?ids=${encodeURIComponent(ids.join(','))}`)
      .then(assets => {
        assets.forEach(asset => dispatch(addItem(asset, 'assets')));
        dispatch({type: RECEIVE_MULTIPLE_ASSETS, assets: assets.map(asset => asset.id)});
      })
      .catch(error => dispatch({type: FAILURE_MULTIPLE_ASSSETS, error}));
  };
};
