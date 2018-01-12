import React from 'react';
import PropTypes from 'prop-types';
import styles from './CountBadge.css';

import t from 'coral-framework/services/i18n';

const CountBadge = ({ count }) => {
  let number = count;

  // shorten large counts to abbreviations
  if (number / 1e9 > 1) {
    number = `${(number / 1e9).toFixed(1)}${t('modqueue.billion')}`;
  } else if (number / 1e6 > 1) {
    number = `${(number / 1e6).toFixed(1)}${t('modqueue.million')}`;
  } else if (number / 1e3 > 1) {
    number = `${(number / 1e3).toFixed(1)}${t('modqueue.thousand')}`;
  }

  return <span className={styles.count}>{number}</span>;
};

CountBadge.propTypes = {
  count: PropTypes.number.isRequired,
};

export default CountBadge;
