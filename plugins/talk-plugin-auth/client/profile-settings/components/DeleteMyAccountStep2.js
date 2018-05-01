import React from 'react';
import cn from 'classnames';
import { Button } from 'plugin-api/beta/client/components/ui';
import styles from './DeleteMyAccountStep.css';

const DeleteMyAccountStep1 = props => (
  <div className={styles.step}>
    <p className={styles.description}>
      Before your account is deleted, we recommend you download your comment
      history for your records. After your account is deleted, you will be
      unable to request your comment history.
    </p>
    <p className={styles.description}>
      To download your comment history go to:
      <strong className={styles.block}>
        My Profile {`>`} Download My Comment History
      </strong>
    </p>
    <div className={cn(styles.actions)}>
      <Button className={cn(styles.button, styles.cancel)}>Cancel</Button>
      <Button
        className={cn(styles.button, styles.proceed)}
        onClick={props.goToNextStep}
      >
        Proceed
      </Button>
    </div>
  </div>
);

export default DeleteMyAccountStep1;
