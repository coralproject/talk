import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';
import { t } from 'plugin-api/beta/client/services';
import { Icon } from 'plugin-api/beta/client/components/ui';
import cn from 'classnames';

const BanUserAction = ({ onBanUser }) => (
  <button
    className={cn(styles.button, 'talk-plugin-moderation-actions-ban')}
    onClick={onBanUser}
  >
    <Icon name="block" className={styles.icon} />
    {t('talk-plugin-moderation-actions.ban_user')}
  </button>
);

BanUserAction.propTypes = {
  onBanUser: PropTypes.func,
};

export default BanUserAction;
