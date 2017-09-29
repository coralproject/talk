import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styles from './FlagDetails.css';
import {t} from 'plugin-api/beta/client/services';
import CommentDetail from 'coral-admin/src/components/CommentDetail';

class FlagDetails extends Component {

  render() {
    const {comment: {actions}, viewUserDetail, more} = this.props;

    const flagActions = actions && actions.filter((a) => a.__typename === 'FlagAction');
    const summaries = flagActions.reduce((sum, action) => {
      if (!(action.reason in sum)) {
        sum[action.reason] = {count: 0, userFlagged: false, actions: []};
      }
      sum[action.reason].count++;
      if (action.user) {
        sum[action.reason].userFlagged = true;
      }
      sum[action.reason].actions.push(action);
      return sum;
    }, {});

    const userFlagReasons = Object.keys(summaries).filter((reason) => summaries[reason].userFlagged);

    return (
      <CommentDetail
        icon={'flag'}
        header={`${t('community.flags')} (${Object.keys(summaries).length})`}
        info={
          <ul className={styles.info}>
            {Object.keys(summaries).map((reason) =>
              <li key={reason} className={styles.lessDetail}>
                {reason} {summaries[reason].userFlagged && `(${summaries[reason].count})`}
              </li>
            )}
          </ul>
        }>
        {more && userFlagReasons.length > 0 && (
          <ul className={styles.detail}>
            {userFlagReasons
              .map((reason) => (
                <li key={reason}>
                  {reason} ({summaries[reason].count})
                  <ul className={styles.subDetail}>
                    {summaries[reason].actions.map((action) =>
                      <li key={action.user.id}>
                        {action.user &&
                          <a className={styles.username} onClick={() => viewUserDetail(action.user.id)}>
                            {action.user.username}
                          </a>
                        }
                        {action.message}
                      </li>
                    )}
                  </ul>
                </li>
              ))
            }
          </ul>
        )}
      </CommentDetail>
    );
  }
}

FlagDetails.propTypes = {
  more: PropTypes.bool,
  comment: PropTypes.shape({
    actions: PropTypes.arrayOf(PropTypes.shape({
      message: PropTypes.string,
      user: PropTypes.shape({username: PropTypes.string})
    })).isRequired,
  }).isRequired,
  viewUserDetail: PropTypes.func.isRequired,
};

export default FlagDetails;
