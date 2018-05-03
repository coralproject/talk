import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { Button, Icon } from 'plugin-api/beta/client/components/ui';
import styles from './DeleteMyAccountStep.css';
import { t } from 'plugin-api/beta/client/services';
import moment from 'moment';

const DeleteMyAccountFinalStep = props => (
  <div className={styles.step}>
    <p className={styles.description}>
      {t('delete_request.your_request_submitted_description')}
    </p>

    <div className={cn(styles.box, styles.scheduledDeletion)}>
      <strong className={styles.block}>
        {t('delete_request.your_account_deletion_scheduled')}
      </strong>
      <strong className={styles.block}>
        <Icon name="access_time" className={styles.timeIcon} />
        <span>
          {moment(props.scheduledDeletionDate).format('MMM Do YYYY, h:mm a')}
        </span>
      </strong>
    </div>

    <p className={styles.description}>
      <strong> {t('delete_request.changed_your_mind')}</strong>{' '}
      {t('delete_request.simply_go_to')} “<strong>
        {t('delete_request.cancel_account_deletion_request')}.
      </strong>”
    </p>

    <p className={styles.description}>
      <strong>{t('delete_request.tell_us_why')}.</strong>{' '}
      {t('delete_request.feedback_copy')}{' '}
      <a href={`mailto:${props.organizationContactEmail}`}>
        {props.organizationContactEmail}
      </a>.
    </p>

    <div className={cn(styles.actions, styles.columnView)}>
      <Button
        className={cn(styles.button, styles.proceed)}
        onClick={props.finish}
        full
      >
        {t('delete_request.done')}
      </Button>
    </div>
  </div>
);

DeleteMyAccountFinalStep.propTypes = {
  finish: PropTypes.func.isRequired,
  scheduledDeletionDate: PropTypes.any.isRequired,
  organizationContactEmail: PropTypes.string.isRequired,
};

export default DeleteMyAccountFinalStep;
