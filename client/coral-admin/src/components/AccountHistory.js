import React from 'react';
import PropTypes from 'prop-types';
import {murmur3} from 'murmurhash-js';
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
        <div className={cn(styles.table, 'talk-admin-account-history')}>
          <div className={cn(styles.headerRow, 'talk-admin-account-history-header-row')}>
            <div className={styles.headerRowItem}>Date</div>
            <div className={styles.headerRowItem}>Action</div>
            <div className={styles.headerRowItem}>Moderation</div>
          </div>
          {
            userHistory.map((h) => (
              <div className={cn(styles.row, 'talk-admin-account-history-row')} key={`${h.__typename}_${murmur3(h.created_at)}`}>
                <div className={cn(styles.item, 'talk-admin-account-history-row-date')}>
                  {moment(new Date(h.created_at)).format('MMM DD, YYYY')}
                </div>
                <div className={cn(styles.item, styles.action, 'talk-admin-account-history-row-status')}>
                  {buildActionResponse(h.__typename, h.status)}
                </div>
                <div className={cn(styles.item, 'talk-admin-account-history-row-assigned-by')}>
                  {h.assigned_by ? h.assigned_by.username : 'SYSTEM'}
                </div>
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
