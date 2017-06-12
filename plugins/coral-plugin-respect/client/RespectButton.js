import React from 'react';
import Icon from './Icon';
import styles from './styles.css';
import {withReaction} from 'plugin-api/beta/client/hocs';
import {t, can} from 'plugin-api/beta/client/services';
import cn from 'classnames';

const plugin = 'coral-plugin-respect';

class RespectButton extends React.Component {
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
          className={cn(styles.button, {[styles.respected]: alreadyReacted}, `${plugin}-button`)}
          onClick={this.handleClick}
        >
          <span className={`${plugin}-button-text`}>
            {t(alreadyReacted ? 'coral-plugin-respect.respected' : 'coral-plugin-respect.respect')}
          </span>
          <Icon className={cn(styles.icon, `${plugin}-icon`)} />
          <span className={cn(styles.icon, `${plugin}-count`)}>{count > 0 && count}</span>
        </button>
      </div>
    );
  }
}

export default withReaction('respect')(RespectButton);
