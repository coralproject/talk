import React from 'react';
import PropTypes from 'prop-types';
import { murmur3 } from 'murmurhash-js';
import styles from './AccountHistory.css';
import cn from 'classnames';
import flatten from 'lodash/flatten';
import orderBy from 'lodash/orderBy';
import has from 'lodash/has';
import moment from 'moment';
import t from 'coral-framework/services/i18n';
import { Icon } from 'coral-ui';

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
    ? durAsDays > 1
      ? t('suspenduser.days', durAsDays)
      : t('suspenduser.day', durAsDays)
    : durAsHours > 1
      ? t('suspenduser.hours', durAsHours)
      : t('suspenduser.hour', durAsHours);
};

const buildActionResponse = (typename, created_at, until, status) => {
  switch (typename) {
    case 'UsernameStatusHistory':
      return t('account_history.username_status', status);
    case 'BannedStatusHistory':
      return status
        ? t('account_history.user_banned')
        : t('account_history.ban_removed');
    case 'SuspensionStatusHistory':
      return until
        ? t('account_history.suspended', readableDuration(created_at, until))
        : t('account_history.suspension_removed');
    default:
      return '-';
  }
};

const getModerationValue = assignedBy =>
  has(assignedBy, 'username') ? (
    assignedBy.username
  ) : (
    <span>
      <Icon name="computer" /> {t('account_history.system')}
    </span>
  );

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
            <div className={styles.headerRowItem}>
              {t('account_history.date')}
            </div>
            <div className={styles.headerRowItem}>
              {t('account_history.action')}
            </div>
            <div className={styles.headerRowItem}>
              {t('account_history.taken_by')}
            </div>
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
                    styles.username,
                    'talk-admin-account-history-row-assigned-by'
                  )}
                >
                  {getModerationValue(assigned_by)}
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
