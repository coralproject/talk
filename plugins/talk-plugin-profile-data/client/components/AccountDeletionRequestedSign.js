import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { t } from 'plugin-api/beta/client/services';
import moment from 'moment';
import { Button, Icon } from 'plugin-api/beta/client/components/ui';
import styles from './AccountDeletionRequestedSign.css';
import { getErrorMessages } from 'coral-framework/utils';
import { scheduledDeletionDelayHours } from '../../config';

class AccountDeletionRequestedSign extends React.Component {
  cancelAccountDeletion = async () => {
    const { cancelAccountDeletion, notify } = this.props;
    try {
      await cancelAccountDeletion();
      notify('success', t('delete_request.account_deletion_cancelled'));
    } catch (err) {
      notify('error', getErrorMessages(err));
    }
  };

  render() {
    const {
      me: { scheduledDeletionDate },
    } = this.props.root;

    const deletionScheduledFor = moment(scheduledDeletionDate).format(
      'MMM Do YYYY, h:mm a'
    );
    const deletionScheduledOn = moment(scheduledDeletionDate)
      .subtract(scheduledDeletionDelayHours, 'hours')
      .format('MMM Do YYYY, h:mm a');

    return (
      <div className={styles.container}>
        <h4 className={styles.title}>
          <Icon name="warning" className={styles.icon} />{' '}
          {t('delete_request.account_deletion_requested')}
        </h4>
        <p className={styles.description}>
          {t('delete_request.received_on')}
          {deletionScheduledOn}.
        </p>
        <p className={styles.description}>
          {t('delete_request.cancel_request_description')}
          <b>
            {' '}
            {t('delete_request.before')} {deletionScheduledFor}
          </b>.
        </p>
        <div className={styles.actions}>
          <Button
            className={cn(styles.button, styles.secondary)}
            onClick={this.cancelAccountDeletion}
          >
            {t('delete_request.cancel_account_deletion_request')}
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
