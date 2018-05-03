import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { Button, Icon } from 'plugin-api/beta/client/components/ui';
import styles from './DeleteMyAccountStep.css';
import { t } from 'plugin-api/beta/client/services';

const DeleteMyAccountFinalStep = props => (
  <div className={styles.step}>
    <p className={styles.description}>
      {t(
        'talk-plugin-profile-data.delete_request.your_request_submitted_description'
      )}
    </p>

    <div className={cn(styles.box, styles.scheduledDeletion)}>
      <strong className={styles.block}>
        {t(
          'talk-plugin-profile-data.delete_request.your_account_deletion_scheduled'
        )}
      </strong>
      <strong className={styles.block}>
        <Icon name="access_time" className={styles.timeIcon} />
        <span>{0}</span>
      </strong>
    </div>

    <p className={styles.description}>
      <strong>
        {' '}
        {t('talk-plugin-profile-data.delete_request.changed_your_mind')}
      </strong>{' '}
      {t('talk-plugin-profile-data.delete_request.simply_go_to')} “<strong>
        {t(
          'talk-plugin-profile-data.delete_request.cancel_account_deletion_request'
        )}.
      </strong>”
    </p>

    <p className={styles.description}>
      <strong>
        {t('talk-plugin-profile-data.delete_request.tell_us_why')}.
      </strong>{' '}
      {t('talk-plugin-profile-data.delete_request.feedback_copy')}
    </p>

    <div className={cn(styles.actions, styles.columnView)}>
      <Button
        className={cn(styles.button, styles.proceed)}
        onClick={props.finish}
        full
      >
        {t('talk-plugin-profile-data.delete_request.done')}
      </Button>
    </div>
  </div>
);

DeleteMyAccountFinalStep.propTypes = {
  finish: PropTypes.func.isRequired,
};

export default DeleteMyAccountFinalStep;
