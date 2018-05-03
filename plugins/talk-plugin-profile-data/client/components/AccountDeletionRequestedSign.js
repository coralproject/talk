import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import moment from 'moment';
import { Button, Icon } from 'plugin-api/beta/client/components/ui';
import styles from './AccountDeletionRequestedSign.css';
import { getErrorMessages } from 'coral-framework/utils';

class AccountDeletionRequestedSign extends React.Component {
  cancelAccountDeletion = async () => {
    const { cancelAccountDeletion, notify } = this.props;
    try {
      await cancelAccountDeletion();
      notify(
        'success',
        'Account Deletion Request Cancelled - Your request to delete your account has been cancelled. You may now write comments, reply to comments, and select reactions.'
      );
    } catch (err) {
      notify('error', getErrorMessages(err));
    }
  };

  render() {
    const { me: { scheduledDeletionDate } } = this.props.root;

    const deletionScheduledFor = moment(scheduledDeletionDate).format(
      'MMM Do YYYY, h:mm a'
    );
    const deletionScheduledOn = moment(scheduledDeletionDate)
      .subtract(24, 'hours')
      .format('MMM Do YYYY, h:mm a');

    return (
      <div className={styles.container}>
        <h4 className={styles.title}>
          <Icon name="warning" className={styles.icon} />Account Deletion
          Requested
        </h4>
        <p className={styles.description}>
          A request to delete your account was received on{' '}
          {deletionScheduledFor}.
        </p>
        <p className={styles.description}>
          If you would like to continue leaving comments, replies or reactions,
          you may cancel your request to delete your account below{' '}
          <b>before {deletionScheduledOn}</b>.
        </p>
        <div className={styles.actions}>
          <Button
            className={cn(styles.button, styles.secondary)}
            onClick={this.cancelAccountDeletion}
          >
            Cancel Account Deletion Request
          </Button>
        </div>
      </div>
    );
  }
}

AccountDeletionRequestedSign.propTypes = {
  cancelAccountDeletion: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
  root: PropTypes.object.isRequired,
};

export default AccountDeletionRequestedSign;
