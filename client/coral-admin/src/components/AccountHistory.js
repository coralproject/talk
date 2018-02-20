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

/** readableDuration returns a readable duration of the suspension/ban in hours or days
 * @param  {} startDate
 * @param  {} endDate
 */
const readableDuration = (startDate, endDate) => {
  const dur = moment.duration(moment(endDate).diff(moment(startDate)));
  const durAsDays = dur.asDays().toFixed(0);
  const durAsHours = dur.asHours().toFixed(0);

  return durAsHours > 23
    ? `${durAsDays} ${durAsDays > 1 ? 'days' : 'day'}`
    : `${durAsHours} ${durAsHours > 1 ? 'hours' : 'hour'}`;
};

const buildActionResponse = (typename, created_at, until, status) => {
  switch (typename) {
    case 'UsernameStatusHistory':
      return `Username ${status}`;
    case 'BannedStatusHistory':
      return status ? 'User banned' : 'Ban removed';
    case 'SuspensionStatusHistory':
      return until
        ? `Suspended, ${readableDuration(created_at, until)}`
        : 'Suspension removed';
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
                  {buildActionResponse(__typename, created_at, until, status)}
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
