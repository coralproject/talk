import React from 'react';
import Icon from './Icon';
import styles from './UpvoteButton.css';
import { withReaction } from 'plugin-api/beta/client/hocs';
import cn from 'classnames';

const plugin = 'talk-plugin-upvote';

class UpvoteButton extends React.Component {
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

    if (alreadyReacted) {
      deleteReaction();
    } else {
      postReaction();
    }
  };

  render() {
    const { count, alreadyReacted } = this.props;
    return (
      <div className={cn(styles.container, `${plugin}-container`)}>
        <button
          className={cn(
            styles.button,
            {
              [`${styles.upvoted} talk-plugin-upvote-upvoted`]: alreadyReacted,
            },
            `${plugin}-button`
          )}
          onClick={this.handleClick}
        >
          <Icon className={cn(styles.icon, `${plugin}-icon`)} />
          <span className={cn(`${plugin}-count`)}>{count > 0 && count}</span>
        </button>
      </div>
    );
  }
}

export default withReaction('upvote')(UpvoteButton);
