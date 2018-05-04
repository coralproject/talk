import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Button } from 'plugin-api/beta/client/components/ui';
import styles from './DeleteMyAccountStep.css';
import { t } from 'plugin-api/beta/client/services';
import { scheduledDeletionDelayHours } from '../../config';

const DeleteMyAccountStep1 = props => (
  <div className={styles.step}>
    <h4 className={styles.subTitle}>{t('delete_request.step_1.subtitle')}</h4>
    <p className={styles.description}>
      {t('delete_request.step_1.description', scheduledDeletionDelayHours)}
    </p>
    <h4 className={styles.subTitle}>{t('delete_request.step_1.subtitle_2')}</h4>
    <p className={styles.description}>
      {t('delete_request.step_1.description_2', scheduledDeletionDelayHours)}
    </p>
    <div className={cn(styles.actions)}>
      <Button
        className={cn(styles.button, styles.cancel)}
        onClick={props.cancel}
      >
        {t('delete_request.cancel')}
      </Button>
      <Button
        className={cn(styles.button, styles.proceed)}
        onClick={props.goToNextStep}
      >
        {t('delete_request.proceed')}
      </Button>
    </div>
  </div>
);

DeleteMyAccountStep1.propTypes = {
  goToNextStep: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
};

export default DeleteMyAccountStep1;
