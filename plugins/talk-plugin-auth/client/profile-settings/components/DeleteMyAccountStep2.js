import React from 'react';
import cn from 'classnames';
import { Button } from 'plugin-api/beta/client/components/ui';
import styles from './DeleteMyAccountStep.css';

const DeleteMyAccountStep1 = () => (
  <div className={styles.step}>
    <p className={styles.description}>
      Before your account is deleted, we recommend you download your comment
      history for your records. After your account is deleted, you will be
      unable to request your comment history.
    </p>
    <p>To download your comment history go to:</p>
    <strong>My Profile Download My Comment History</strong>
    <div className={cn(styles.actions)}>
      <Button className={cn(styles.button, styles.cancel)}>Cancel</Button>
      <Button
        className={cn(styles.button, styles.proceed)}
        onClick={this.goToNextStep}
      >
        Proceed
      </Button>
    </div>
  </div>
);

export default DeleteMyAccountStep1;
