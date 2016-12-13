import coralApi from '../helpers/response';
import addItem from './items';

export const FETCH_MULTIPLE_ASSETS = 'FETCH_MULTIPLE_ASSETS';
export const RECEIVE_MULTIPLE_ASSETS = 'RECEIVE_MULTIPLE_ASSETS';
export const FAILURE_MULTIPLE_ASSSETS = 'FAILURE_MULTIPLE_ASSSETS';

export const fetchMulitpleAssets = ids => {
  return dispatch => {
    dispatch({type: FETCH_MULTIPLE_ASSETS});

    coralApi(`/asset/multi?ids=${encodeURIComponent(ids.join(','))}`)
      .then(assets => {
        dispatch({type: RECEIVE_MULTIPLE_ASSETS, assets});
        console.log('assets!', assets);
      })
      .catch(error => dispatch({type: FAILURE_MULTIPLE_ASSSETS, error}));
  };
};
