import React from 'react';
import cn from 'classnames';
import { Button, Icon } from 'plugin-api/beta/client/components/ui';
import styles from './DeleteMyAccountStep.css';

const DeleteMyAccountFinalStep = () => (
  <div className={styles.step}>
    <p className={styles.description}>
      Your request has been submitted and confirmation has been sent to the
      email address associated with your account.
    </p>
    <strong> Your account is scheduled to be deleted at:</strong>
    <strong>
      <Icon name="clock" />Account Deletion Date and Time
    </strong>
    <p className={styles.description}>
      <strong>Changed your mind?</strong> Simply sign in to your account again
      before this time and click “<strong>
        Cancel Account Deletion Request.
      </strong>”
    </p>
    <p className={styles.description}>
      <strong>Tell us why.</strong> Wed like to know why you chose to delete
      your account. Send us feedback on our comment system by emailing.
    </p>
    <div className={cn(styles.actions)}>
      <Button
        className={cn(styles.button, styles.proceed)}
        onClick={this.closeDialog}
      >
        Done
      </Button>
      <small className={styles.note}>
        Note: You will be immediately signed out of your account.
      </small>
    </div>
  </div>
);

export default DeleteMyAccountFinalStep;
