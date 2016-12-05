import React from 'react';
import {I18n} from '../coral-framework';
import translations from './translations.json';

const name = 'coral-plugin-flags';

const LikeButton = ({like, id, postAction, deleteAction, addItem, showSignInDialog, updateItem, currentUser}) => {
  const liked = like && like.current_user;
  const onLikeClick = () => {
    if (!currentUser) {
      showSignInDialog();
      return;
    }
    if (!liked) {
      postAction(id, 'like', currentUser.id, 'comments')
        .then((action) => {
          let id = `${action.action_type}_${action.item_id}`;
          addItem({id, current_user: action, count: like ? like.count + 1 : 1}, 'actions');
          updateItem(action.item_id, action.action_type, id, 'comments');
        });
    } else {
      deleteAction(liked.id)
        .then(() => {
          updateItem(like.id, 'count', like.count - 1, 'actions');
          updateItem(like.id, 'current_user', false, 'actions');
        });
    }
  };

  return <div className={`${name}-container`}>
    <button onClick={onLikeClick} className={`${name}-button ${liked && 'likedButton'}`}>
      {
        liked
        ? <span className={`${name}-button-text`}>{lang.t('liked')}</span>
      : <span className={`${name}-button-text`}>{lang.t('like')}</span>
      }
      <i className={`${name}-icon material-icons`}
        aria-hidden={true}>thumb_up</i>
      <span className={`${name}-like-count`}>{like && like.count > 0 && like.count}</span>
    </button>
  </div>;
};

export default LikeButton;

const lang = new I18n(translations);
