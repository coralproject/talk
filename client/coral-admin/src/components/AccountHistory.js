import React from 'react';
import PropTypes from 'prop-types';
import styles from './AccountHistory.css';
import cn from 'classnames';

class AccountHistory extends React.Component {
  render() {
    return (
      <div>
        <div className={styles.table}>
          <div className={styles.headerRow}>
            <div className={styles.headerRowItem}>Date</div>
            <div className={styles.headerRowItem}>Action</div>
            <div className={styles.headerRowItem}>Moderation</div>
          </div>
          <div className={styles.row}>
            <div className={styles.item}>Date</div>
            <div className={cn(styles.item, styles.action)}>Action</div>
            <div className={styles.item}>Moderation</div>
          </div>
        </div>
      </div>
    );
  }
}

AccountHistory.propTypes = {
  history: PropTypes.array,
};

export default AccountHistory;
