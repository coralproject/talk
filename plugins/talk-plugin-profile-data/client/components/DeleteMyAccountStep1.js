import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Button } from 'plugin-api/beta/client/components/ui';
import styles from './DeleteMyAccountStep.css';

const DeleteMyAccountStep1 = props => (
  <div className={styles.step}>
    <h4 className={styles.subTitle}>When will my account be deleted?</h4>
    <p className={styles.description}>
      Your account will be deleted 24 hours after your request has been
      submitted.
    </p>
    <h4 className={styles.subTitle}>
      Can I still write comments until my account is deleted?{' '}
    </h4>
    <p className={styles.description}>
      No. Once youve requested account deletion, you can no longer write
      comments, reply to comments, or select reactions.
    </p>
    <div className={cn(styles.actions)}>
      <Button
        className={cn(styles.button, styles.cancel)}
        onClick={props.cancel}
      >
        Cancel
      </Button>
      <Button
        className={cn(styles.button, styles.proceed)}
        onClick={props.goToNextStep}
      >
        Proceed
      </Button>
    </div>
  </div>
);

DeleteMyAccountStep1.propTypes = {
  goToNextStep: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
};

export default DeleteMyAccountStep1;
