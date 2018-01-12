import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './FlagDetails.css';
import { t } from 'plugin-api/beta/client/services';
import {
  Slot,
  IfSlotIsNotEmpty,
  CommentDetail,
} from 'plugin-api/beta/client/components';

class FlagDetails extends Component {
  render() {
    const { comment: { actions }, more, data, root, comment } = this.props;

    const flagActions =
      actions && actions.filter(a => a.__typename === 'FlagAction');
    const summaries = flagActions.reduce((sum, action) => {
      if (!(action.reason in sum)) {
        sum[action.reason] = { count: 0, actions: [] };
      }
      sum[action.reason].count++;
      if (action.user) {
        sum[action.reason].userFlagged = true;
      }
      return sum;
    }, {});

    const reasons = Object.keys(summaries);
    const queryData = {
      root,
      comment,
    };

    return (
      <CommentDetail
        icon={'flag'}
        header={`${t('talk-plugin-flag-details.flags')} (${
          Object.keys(summaries).length
        })`}
        info={
          <ul className={styles.info}>
            {reasons.map(reason => (
              <li key={reason} className={styles.lessDetail}>
                {t(`flags.reasons.comment.${reason.toLowerCase()}`)}{' '}
                {summaries[reason].userFlagged &&
                  `(${summaries[reason].count})`}
              </li>
            ))}
          </ul>
        }
      >
        {more && (
          <IfSlotIsNotEmpty
            slot="adminCommentMoreFlagDetails"
            queryData={queryData}
          >
            <Slot
              fill="adminCommentMoreFlagDetails"
              data={data}
              queryData={queryData}
            />
          </IfSlotIsNotEmpty>
        )}
      </CommentDetail>
    );
  }
}

FlagDetails.propTypes = {
  more: PropTypes.bool,
  data: PropTypes.object,
  root: PropTypes.object,
  comment: PropTypes.shape({
    actions: PropTypes.arrayOf(
      PropTypes.shape({
        message: PropTypes.string,
        user: PropTypes.shape({ username: PropTypes.string }),
      })
    ).isRequired,
  }).isRequired,
};

export default FlagDetails;
