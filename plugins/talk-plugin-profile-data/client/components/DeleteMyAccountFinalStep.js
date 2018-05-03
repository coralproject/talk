import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { Button, Icon } from 'plugin-api/beta/client/components/ui';
import styles from './DeleteMyAccountStep.css';
import moment from 'moment';

const DeleteMyAccountFinalStep = props => (
  <div className={styles.step}>
    <p className={styles.description}>
      Your request has been submitted and confirmation has been sent to the
      email address associated with your account.
    </p>

    <div className={cn(styles.box, styles.scheduledDeletion)}>
      <strong className={styles.block}>
        Your account is scheduled to be deleted at:
      </strong>
      <strong className={styles.block}>
        <Icon name="access_time" className={styles.timeIcon} />
        <span>
          {moment(props.scheduledDeletionDate).format('MMM Do YYYY, h:mm:ss a')}
        </span>
      </strong>
    </div>

    <p className={styles.description}>
      <strong>Changed your mind?</strong> Simply go to your account again before
      this time and click “<strong>Cancel Account Deletion Request.</strong>”
    </p>

    <p className={styles.description}>
      <strong>Tell us why.</strong> Wed like to know why you chose to delete
      your account. Send us feedback on our comment system by emailing.
    </p>

    <div className={cn(styles.actions, styles.columnView)}>
      <Button
        className={cn(styles.button, styles.proceed)}
        onClick={props.finish}
        full
      >
        Done
      </Button>
    </div>
  </div>
);

DeleteMyAccountFinalStep.propTypes = {
  finish: PropTypes.func.isRequired,
  scheduledDeletionDate: PropTypes.string.isRequired,
};

export default DeleteMyAccountFinalStep;
