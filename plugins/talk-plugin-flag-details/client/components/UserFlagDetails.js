import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { t } from 'plugin-api/beta/client/services';
import styles from './UserFlagDetails.css';

class UserFlagDetails extends Component {
  render() {
    const { comment: { actions }, viewUserDetail } = this.props;

    const flagActions =
      actions && actions.filter(a => a.__typename === 'FlagAction');
    const summaries = flagActions.reduce((sum, action) => {
      if (!action.user) {
        return sum;
      }
      if (!(action.reason in sum)) {
        sum[action.reason] = { count: 0, actions: [] };
      }
      sum[action.reason].count++;
      sum[action.reason].actions.push(action);
      return sum;
    }, {});

    return (
      <ul className={styles.detail}>
        {Object.keys(summaries).map(reason => (
          <li key={reason}>
            {t(`flags.reasons.comment.${reason.toLowerCase()}`)} ({
              summaries[reason].count
            })
            <ul className={styles.subDetail}>
              {summaries[reason].actions.map(action => (
                <li key={action.user.id}>
                  {action.user && (
                    <a
                      className={styles.username}
                      onClick={() => viewUserDetail(action.user.id)}
                    >
                      {action.user.username}
                    </a>
                  )}
                  {action.message}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    );
  }
}

UserFlagDetails.propTypes = {
  comment: PropTypes.shape({
    actions: PropTypes.arrayOf(
      PropTypes.shape({
        message: PropTypes.string,
        user: PropTypes.shape({ username: PropTypes.string }),
      })
    ).isRequired,
  }).isRequired,
  viewUserDetail: PropTypes.func.isRequired,
};

export default UserFlagDetails;
