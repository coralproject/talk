import React from 'react';
import PropTypes from 'prop-types';
import styles from './AccountHistory.css';
import cn from 'classnames';
import flatten from 'lodash/flatten';
import orderBy from 'lodash/orderBy';
import moment from 'moment';

const buildUserHistory = (userState = {}) => {
  return orderBy(flatten(Object.keys(userState.status)
    .filter((k) => k !== '__typename')
    .map((k) => userState.status[k].history)), 'created_at', 'desc');
};

const buildActionResponse = (typename, status) => {
  const actionResponses = {
    'UsernameStatusHistory' : `Username Status: ${status}`,
    'BannedStatusHistory': status ? 'User banned' : 'Ban removed',
    'SuspensionStatusHistory': status ? 'Account Suspended' : 'Suspension removed'
  };

  return actionResponses[typename];
};

class AccountHistory extends React.Component {
  render() {
    const {userState} = this.props;
    const userHistory = buildUserHistory(userState);
    return (
      <div>
        <div className={styles.table}>
          <div className={styles.headerRow}>
            <div className={styles.headerRowItem}>Date</div>
            <div className={styles.headerRowItem}>Action</div>
            <div className={styles.headerRowItem}>Moderation</div>
          </div>
          {
            userHistory.map((h, i) => (
              <div className={styles.row} key={i}>
                <div className={styles.item}>{moment(new Date(h.created_at)).format('MMM DD, YYYY')}</div>
                <div className={cn(styles.item, styles.action)}>{buildActionResponse(h.__typename, h.status)}</div>
                <div className={styles.item}>{h.assigned_by ? h.assigned_by.username : 'SYSTEM'}</div>
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}

AccountHistory.propTypes = {
  history: PropTypes.array,
  userState: PropTypes.object,
};

export default AccountHistory;
