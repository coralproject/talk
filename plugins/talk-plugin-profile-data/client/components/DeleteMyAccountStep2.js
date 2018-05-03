import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Button } from 'plugin-api/beta/client/components/ui';
import styles from './DeleteMyAccountStep.css';
import { t } from 'plugin-api/beta/client/services';

const DeleteMyAccountStep2 = props => (
  <div className={styles.step}>
    <p className={styles.description}>
      {t('delete_request.step_2.description')}
    </p>
    <p className={styles.description}>
      {t('delete_request.step_2.to_download')}
      <strong className={styles.block}>
        {t('delete_request.step_2.path')}
      </strong>
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

DeleteMyAccountStep2.propTypes = {
  goToNextStep: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
};

export default DeleteMyAccountStep2;
