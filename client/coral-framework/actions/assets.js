import * as actions from '../constants/assets';
import coralApi from '../helpers/response';
import {addItem} from './items';

export const fetchMulitpleAssets = ids => {
  return dispatch => {
    dispatch({type: actions.MULTIPLE_ASSETS_REQUEST});

    coralApi(`/assets/multi?ids=${encodeURIComponent(ids.join(','))}`)
      .then(assets => {
        assets.forEach(asset => dispatch(addItem(asset, 'assets')));
        dispatch({type: actions.MULTIPLE_ASSETS_SUCCESS, assets: assets.map(asset => asset.id)});
      })
      .catch(error => dispatch({type: actions.MULTIPLE_ASSSETS_FAILURE, error}));
  };
};
