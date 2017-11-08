import React from 'react';
import PropTypes from 'prop-types';

import cn from 'classnames';
import styles from './RejectButton.css';
import {Icon} from 'coral-ui';

import t from 'coral-framework/services/i18n';

const RejectButton = ({active, minimal, onClick, className}) => {
  const text = active ? t('modqueue.rejected') : t('modqueue.reject');
  return (
    <button
      className={cn(styles.root, {[styles.minimal]: minimal, [styles.active]: active}, className)}
      onClick={onClick}
    >
      <Icon name={'close'} className={styles.icon} />
      {!minimal && text}
    </button>
  );
};

RejectButton.propTypes = {
  className: PropTypes.string,
  active: PropTypes.bool,
  minimal: PropTypes.bool,
  onClick: PropTypes.func,
};

export default RejectButton;

