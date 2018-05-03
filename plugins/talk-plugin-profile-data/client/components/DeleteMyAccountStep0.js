import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Button, Icon } from 'plugin-api/beta/client/components/ui';
import styles from './DeleteMyAccountStep.css';
import { t } from 'plugin-api/beta/client/services';

const DeleteMyAccountStep0 = props => (
  <div className={styles.step}>
    <p className={styles.description}>
      {t('talk-plugin-profile-data.delete_request.you_are_attempting')}
    </p>
    <ul className={styles.list}>
      <li className={styles.item}>
        <Icon name="done" className={styles.itemIcon} />
        <span className={styles.text}>
          {t('talk-plugin-profile-data.delete_request.item_1')}
        </span>
      </li>
      <li className={styles.item}>
        <Icon name="done" className={styles.itemIcon} />
        <span className={styles.text}>
          {t('talk-plugin-profile-data.delete_request.item_2')}
        </span>
      </li>
      <li className={styles.item}>
        <Icon name="done" className={styles.itemIcon} />
        <span className={styles.text}>
          {t('talk-plugin-profile-data.delete_request.item_3')}
        </span>
      </li>
    </ul>
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

DeleteMyAccountStep0.propTypes = {
  goToNextStep: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
};

export default DeleteMyAccountStep0;
