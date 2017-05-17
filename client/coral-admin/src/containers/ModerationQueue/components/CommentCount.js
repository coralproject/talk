import React, {PropTypes} from 'react';
import styles from './CommentCount.css';

import t from 'coral-i18n/services/i18n';

const CommentCount = ({count}) => {
  let number = count;

  // shorten large counts to abbreviations
  if (number / 1e9 > 1) {
    number = `${(number / 1e9).toFixed(1)}${t('modqueue.billion')}`;
  } else if (number / 1e6 > 1) {
    number = `${(number / 1e6).toFixed(1)}${t('modqueue.million')}`;
  } else if (number / 1e3 > 1) {
    number = `${(number / 1e3).toFixed(1)}${t('modqueue.thousand')}`;
  }

  return (
    <span className={styles.count}>{number}</span>
  );
};

CommentCount.propTypes = {
  count: PropTypes.number.isRequired
};

export default CommentCount;
