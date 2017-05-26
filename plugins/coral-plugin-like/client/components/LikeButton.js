import React, {Component} from 'react';
import styles from './style.css';

import {I18n} from 'coral-framework';
import cn from 'classnames';
import translations from '../translations.json';
import {getMyActionSummary, getTotalActionCount} from 'coral-framework/utils';

const lang = new I18n(translations);
const name = 'coral-plugin-like';

class LikeButton extends Component {
  handleClick = () => {
    const {postLike, showSignInDialog, deleteAction} = this.props;
    const {root: {me}, comment} = this.props;

    const myLikeActionSummary = getMyActionSummary(
      'LikeActionSummary',
      comment
    );

    // If the current user does not exist, trigger sign in dialog.
    if (!me) {
      showSignInDialog();
      return;
    }

    // If the current user is banned, do nothing.
    if (me.status === 'BANNED') {
      return;
    }

    if (myLikeActionSummary) {
      deleteAction(myLikeActionSummary.current_user.id, comment.id);
    } else {
      postLike({
        item_id: comment.id,
        item_type: 'COMMENTS'
      });
    }
  };

  render() {
    const {comment} = this.props;

    if (!comment) {
      return null;
    }

    const myLike = getMyActionSummary('LikeActionSummary', comment);
    let count = getTotalActionCount('LikeActionSummary', comment);

    return (
      <div className={cn(styles.like, `${name}-container`)}>
        <button
          className={cn(
            styles.button,
            {[styles.liked]: myLike},
            `${name}-button`
          )}
          onClick={this.handleClick}
        >
          <span className={`${name}-button-text`}>
            {lang.t(myLike ? 'liked' : 'like')}
          </span>
          <i
            className={cn(
              styles.icon,
              'material-icons',
              {[styles.liked]: myLike},
              `${name}-icon`
            )}
            aria-hidden={true}
          >
            thumb_up
          </i>
          <span className={`${name}-count`}>{count > 0 && count}</span>
        </button>
      </div>
    );
  }
}

LikeButton.propTypes = {
  data: React.PropTypes.object.isRequired
};

export default LikeButton;
