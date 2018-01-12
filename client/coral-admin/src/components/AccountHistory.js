import React from 'react';
import PropTypes from 'prop-types';
import { murmur3 } from 'murmurhash-js';
import styles from './AccountHistory.css';
import cn from 'classnames';
import flatten from 'lodash/flatten';
import orderBy from 'lodash/orderBy';
import moment from 'moment';

const buildUserHistory = (userState = {}) => {
  return orderBy(
    flatten(
      Object.keys(userState.status)
        .filter(k => k !== '__typename')
        .map(k => userState.status[k].history)
    ),
    'created_at',
    'desc'
  );
};

const buildActionResponse = (typename, until, status) => {
  switch (typename) {
    case 'UsernameStatusHistory':
      return `Username ${status}`;
    case 'BannedStatusHistory':
      return status ? 'User banned' : 'Ban removed';
    case 'SuspensionStatusHistory':
      return until ? 'Account Suspended' : 'Suspension removed';
    default:
      return '-';
  }
};

const getModerationValue = (userId, assignedBy = {}) => {
  if (assignedBy && userId !== assignedBy.id) {
    return assignedBy.username;
  }
  return 'SYSTEM';
};

class AccountHistory extends React.Component {
  render() {
    const { user } = this.props;
    const userHistory = buildUserHistory(user.state);
    return (
      <div>
        <div className={cn(styles.table, 'talk-admin-account-history')}>
          <div
            className={cn(
              styles.headerRow,
              'talk-admin-account-history-header-row'
            )}
          >
            <div className={styles.headerRowItem}>Date</div>
            <div className={styles.headerRowItem}>Action</div>
            <div className={styles.headerRowItem}>Moderation</div>
          </div>
          {userHistory.map(
            ({ __typename, created_at, assigned_by, until, status }) => (
              <div
                className={cn(styles.row, 'talk-admin-account-history-row')}
                key={`${__typename}_${murmur3(created_at)}`}
              >
                <div
                  className={cn(
                    styles.item,
                    'talk-admin-account-history-row-date'
                  )}
                >
                  {moment(new Date(created_at)).format('MMM DD, YYYY')}
                </div>
                <div
                  className={cn(
                    styles.item,
                    styles.action,
                    'talk-admin-account-history-row-status'
                  )}
                >
                  {buildActionResponse(__typename, until, status)}
                </div>
                <div
                  className={cn(
                    styles.item,
                    'talk-admin-account-history-row-assigned-by'
                  )}
                >
                  {getModerationValue(user.id, assigned_by)}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    );
  }
}

AccountHistory.propTypes = {
  user: PropTypes.object.isRequired,
};

export default AccountHistory;
