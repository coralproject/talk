import React from 'react';
import PropTypes from 'prop-types';
import styles from './CountBadge.css';
import { humanizeNumber } from 'coral-framework/helpers/numbers';

const CountBadge = ({ count }) => {
  let number = count;

  // shorten large counts to abbreviations
  number = humanizeNumber(number);

  return <span className={styles.count}>{number}</span>;
};

CountBadge.propTypes = {
  count: PropTypes.number.isRequired,
};

export default CountBadge;
