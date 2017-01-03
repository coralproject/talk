import * as actions from '../constants/user';
import * as assetActions from '../constants/assets';
import {addNotification} from '../actions/notification';
import {addItem} from '../actions/items';
import coralApi from '../helpers/response';

import I18n from 'coral-framework/modules/i18n/i18n';
import translations from './../translations';
const lang = new I18n(translations);

const saveBioRequest = () => ({type: actions.SAVE_BIO_REQUEST});
const saveBioSuccess = settings => ({type: actions.SAVE_BIO_SUCCESS, settings});
const saveBioFailure = error => ({type: actions.SAVE_BIO_FAILURE, error});

export const saveBio = (user_id, formData) => dispatch => {
  dispatch(saveBioRequest());
  coralApi(`/users/${user_id}/bio`, {method: 'PUT', body: formData})
    .then(({settings}) => {
      dispatch(addNotification('success', lang.t('successBioUpdate')));
      dispatch(saveBioSuccess(settings));
    })
    .catch(error => dispatch(saveBioFailure(error)));
};

/**
 *
 * Get a list of comments by a single user
 *
 * @param {string} user_id
 * @returns Promise
 */
export const fetchCommentsByUserId = userId => {
  return (dispatch) => {
    dispatch({type: actions.COMMENTS_BY_USER_REQUEST});
    return coralApi(`/comments?user_id=${userId}`)
      .then(({comments, assets}) => {
        comments.forEach(comment => dispatch(addItem(comment, 'comments')));

        assets.forEach(asset => dispatch(addItem(asset, 'assets')));

        dispatch({type: actions.COMMENTS_BY_USER_SUCCESS, comments: comments.map(comment => comment.id)});
        dispatch({type: assetActions.MULTIPLE_ASSETS_SUCCESS, assets: assets.map(asset => asset.id)});
      })
      .catch(error => {
        console.error(error.stack);
        console.error('FAILURE_COMMENTS_BY_USER', error);
        dispatch({type: actions.COMMENTS_BY_USER_FAILURE, error});
      });
  };
};
