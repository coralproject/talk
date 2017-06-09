import React from 'react';
import {Icon} from 'coral-ui';
import styles from './styles.css';
import {withReaction} from 'plugin-api/beta/client/hocs';
import {t, can} from 'plugin-api/beta/client/services';

class LoveButton extends React.Component {
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

    if (alreadyReacted()) {
      deleteReaction();
    } else {
      postReaction();
    }
  };

  render() {
    const {count, alreadyReacted} = this.props;
    return (
      <button
        className={`${styles.button} ${alreadyReacted() ? styles.loved : ''}`}
        onClick={this.handleClick}
      >
        <span>{t(alreadyReacted() ? 'loved' : 'love')}</span>
        <Icon name="favorite" />
        <span>{count > 0 && count}</span>
      </button>
    );
  }
}

export default withReaction('love')(LoveButton);
