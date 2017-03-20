import React, { PropTypes } from 'react';
import { Button, Icon } from 'coral-ui';
import styles from './BanUserButton.css';

import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-admin/src/translations.json';
const lang = new I18n(translations);

const BanUserButton = ({ user, ...props }) => (
  <div className={styles.ban}>
    <Button cStyle='ban'
      className={`ban ${styles.banButton}`}
      disabled={user.status === 'BANNED' ? 'disabled' : ''}
      onClick={props.onClick}
      raised>
      <Icon name='not_interested' />
      {lang.t('comment.ban_user')}
    </Button>
  </div>
);

BanUserButton.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default BanUserButton;
