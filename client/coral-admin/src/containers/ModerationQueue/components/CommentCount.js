import React, {PropTypes} from 'react';
import styles from './CommentCount.css';

import I18n from 'coral-i18n/modules/i18n/i18n';
const lang = new I18n();

const CommentCount = ({count}) => {
  let number = count;

  // shorten large counts to abbreviations
  if (number / 1e9 > 1) {
    number = `${(number / 1e9).toFixed(1)}${lang.t('modqueue.billion')}`;
  } else if (number / 1e6 > 1) {
    number = `${(number / 1e6).toFixed(1)}${lang.t('modqueue.million')}`;
  } else if (number / 1e3 > 1) {
    number = `${(number / 1e3).toFixed(1)}${lang.t('modqueue.thousand')}`;
  }

  return (
    <span className={styles.count}>{number}</span>
  );
};

CommentCount.propTypes = {
  count: PropTypes.number.isRequired
};

export default CommentCount;
