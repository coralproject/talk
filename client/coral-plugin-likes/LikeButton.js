import React from 'react';
import {I18n} from '../coral-framework';
import translations from './translations.json';

const name = 'coral-plugin-likes';

const LikeButton = ({like, id, postAction, deleteAction, showSignInDialog, currentUser}) => {
  const liked = like && like.current;
  const onLikeClick = () => {
    if (!currentUser) {
      const offset = document.getElementById(`c_${id}`).getBoundingClientRect().top - 75;
      showSignInDialog(offset);
      return;
    }
    if (currentUser.banned) {
      return;
    }
    if (!liked) {
      postAction({
        item_id: id,
        item_type: 'COMMENTS',
        action_type: 'LIKE'
      });
      // TODO: frontend update from mutation
    } else {
      deleteAction(liked.id);
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
