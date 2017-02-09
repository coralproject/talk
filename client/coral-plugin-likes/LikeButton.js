import React, {Component, PropTypes} from 'react';
import {I18n} from '../coral-framework';
import translations from './translations.json';

const name = 'coral-plugin-likes';

class LikeButton extends Component {

  static propTypes = {
    like: PropTypes.shape({
      current: PropTypes.object,
      count: PropTypes.number
    }),
    id: PropTypes.string,
    postAction: PropTypes.func.isRequired,
    deleteAction: PropTypes.func.isRequired,
    showSignInDialog: PropTypes.func.isRequired,
    currentUser: PropTypes.shape({
      banned: PropTypes.boolean
    }),
  }

  state = {
    localPost: null, // Set to the ID of an action if one is posted
    localDelete: false // Set to true is the user deletes an action, unless localPost is already set.
  }

  render() {
    const {like, id, postAction, deleteAction, showSignInDialog, currentUser} = this.props;
    const {localPost, localDelete} = this.state;
    const liked = (like && like.current && !localDelete) || localPost;
    let count = like ? like.count : 0;
    if (localPost) {count += 1;}
    if (localDelete) {count -= 1;}

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
        this.setState({localPost: 'temp', localDelete: false});
        postAction({
          item_id: id,
          item_type: 'COMMENTS',
          action_type: 'LIKE'
        }).then(({data}) => {
          this.setState({localPost: data.createAction.id});
        });
      } else {
        this.setState((prev) => prev.localPost ? {...prev, localPost: null} : {...prev, localDelete: true});
        deleteAction(localPost || like.current.id);
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
        <span className={`${name}-like-count`}>{count > 0 && count}</span>
      </button>
    </div>;
  }
}

export default LikeButton;

const lang = new I18n(translations);
