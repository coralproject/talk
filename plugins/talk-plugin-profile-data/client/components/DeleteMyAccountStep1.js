import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Button } from 'plugin-api/beta/client/components/ui';
import styles from './DeleteMyAccountStep.css';
import { t } from 'plugin-api/beta/client/services';

const DeleteMyAccountStep1 = props => (
  <div className={styles.step}>
    <h4 className={styles.subTitle}>
      {t('talk-plugin-profile-data.delete_request.step1.subtitle')}
    </h4>
    <p className={styles.description}>
      {t('talk-plugin-profile-data.delete_request.step1.description')}
    </p>
    <h4 className={styles.subTitle}>
      {t('talk-plugin-profile-data.delete_request.step1.subtitle_2')}
    </h4>
    <p className={styles.description}>
      {t('talk-plugin-profile-data.delete_request.step1.description_2')}
    </p>
    <div className={cn(styles.actions)}>
      <Button
        className={cn(styles.button, styles.cancel)}
        onClick={props.cancel}
      >
        {t('talk-plugin-profile-data.delete_request.cancel')}
      </Button>
      <Button
        className={cn(styles.button, styles.proceed)}
        onClick={props.goToNextStep}
      >
        {t('talk-plugin-profile-data.delete_request.proceed')}
      </Button>
    </div>
  </div>
);

DeleteMyAccountStep1.propTypes = {
  goToNextStep: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
};

export default DeleteMyAccountStep1;
