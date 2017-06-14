import React from 'react';
import styles from './styles.css';
import {withReaction} from 'plugin-api/beta/client/hocs';
import {t, can} from 'plugin-api/beta/client/services';
import {Icon} from 'plugin-api/beta/client/components/ui';
import cn from 'classnames';

const plugin = 'coral-plugin-like';

class LikeButton extends React.Component {
  handleClick = () => {
    const {
      postReaction,
      deleteReaction,
      showSignInDialog,
      alreadyReacted,
      user,
    } = this.props;

    // If the current user does not exist, trigger sign in dialog.
    if (!user) {
      showSignInDialog();
      return;
    }

    // If the current user is suspended, do nothing.
    if (!can(user, 'INTERACT_WITH_COMMUNITY')) {
      return;
    }

    if (alreadyReacted) {
      deleteReaction();
    } else {
      postReaction();
    }
  };

  render() {
    const {count, alreadyReacted} = this.props;
    return (
      <div className={cn(styles.container, `${plugin}-container`)}>
        <button
          className={cn(styles.button, {[styles.liked]: alreadyReacted}, `${plugin}-button`)}
          onClick={this.handleClick}
        >
          <span>{t(alreadyReacted ? 'coral-plugin-like.liked' : 'coral-plugin-like.like')}</span>
          <Icon name="thumb_up" className={`${plugin}-icon`} />
          <span className={`${plugin}-count`}>{count > 0 && count}</span>
        </button>
      </div>
    );
  }
}

export default withReaction('like')(LikeButton);
