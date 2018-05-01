import React from 'react';
import cn from 'classnames';
import { Button, Icon } from 'plugin-api/beta/client/components/ui';
import styles from './AccountDeletionRequestedSign.css';

class AccountDeletionRequestedSign extends React.Component {
  render() {
    return (
      <div className={styles.container}>
        <h3>
          <Icon name="warning" />Account Deletion Requested
        </h3>
        <p>
          A request to delete your account was received on. If you would like to
          continue leaving comments, replies or reactions, you may cancel your
          request to delete your account below before
        </p>
        <Button className={cn(styles.button, styles.secondary)}>
          Cancel Account Deletion Request
        </Button>
      </div>
    );
  }
}

export default AccountDeletionRequestedSign;
