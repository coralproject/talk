import React, {PropTypes} from 'react';
import {Button, Icon} from 'coral-ui';
import styles from './BanUserButton.css';

import t from 'coral-framework/services/i18n';

const BanUserButton = ({user, ...props}) => (
  <div className={styles.ban}>
    <Button cStyle='ban'
      className={`ban ${styles.banButton}`}
      disabled={user.status === 'BANNED' ? 'disabled' : ''}
      onClick={props.onClick}
      raised>
      <Icon name='not_interested' />
      {t('comment.ban_user')}
    </Button>
  </div>
);

BanUserButton.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default BanUserButton;
