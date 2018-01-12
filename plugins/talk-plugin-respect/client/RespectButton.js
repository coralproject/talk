import React from 'react';
import Icon from './Icon';
import styles from './styles.css';
import { withReaction } from 'plugin-api/beta/client/hocs';
import { t } from 'plugin-api/beta/client/services';
import cn from 'classnames';

const plugin = 'talk-plugin-respect';

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
              [`${
                styles.respected
              } talk-plugin-respect-respected`]: alreadyReacted,
            },
            `${plugin}-button`
          )}
          onClick={this.handleClick}
        >
          <span className={cn(`${plugin}-label`, styles.label)}>
            {t(
              alreadyReacted
                ? 'talk-plugin-respect.respected'
                : 'talk-plugin-respect.respect'
            )}
          </span>
          <Icon className={cn(styles.icon, `${plugin}-icon`)} />
          <span className={cn(`${plugin}-count`)}>{count > 0 && count}</span>
        </button>
      </div>
    );
  }
}

export default withReaction('respect')(RespectButton);
