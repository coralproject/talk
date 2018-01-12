import React from 'react';
import PropTypes from 'prop-types';
import t from 'coral-framework/services/i18n';
import styles from './InactiveCommentLabel.css';
import { Icon } from 'coral-ui';
import cn from 'classnames';

const InactiveCommentLabel = ({ status, className, ...rest }) => {
  let label;
  let icon;

  switch (status) {
    case 'PREMOD':
      label = t('modqueue.premod');
      icon = 'query_builder';
      break;
    case 'REJECTED':
      label = t('modqueue.rejected');
      icon = 'close';
      break;
    default:
      throw new Error(`Unknown inactive status ${status}`);
  }

  return (
    <span
      {...rest}
      className={cn(className, styles.root, styles[status.toLowerCase()])}
    >
      <Icon name={icon} className={styles.icon} />
      <span className={styles.label}>{label}</span>
    </span>
  );
};

InactiveCommentLabel.propTypes = {
  status: PropTypes.string.isRequired,
};

export default InactiveCommentLabel;
