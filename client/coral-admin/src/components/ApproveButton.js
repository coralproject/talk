import React from 'react';
import PropTypes from 'prop-types';

import cn from 'classnames';
import styles from './ApproveButton.css';
import {Icon} from 'coral-ui';

import t from 'coral-framework/services/i18n';

const ApproveButton = ({active, minimal, onClick, className}) => {
  const text = active ? t('modqueue.approved') : t('modqueue.approve');
  return (
    <button
      className={cn(styles.root, {[styles.minimal]: minimal, [styles.active]: active}, className)}
      onClick={onClick}
    >
      <Icon name={'done'} className={styles.icon} />
      {!minimal && text}
    </button>
  );
};

ApproveButton.propTypes = {
  className: PropTypes.string,
  active: PropTypes.bool,
  minimal: PropTypes.bool,
  onClick: PropTypes.func,
};

export default ApproveButton;

