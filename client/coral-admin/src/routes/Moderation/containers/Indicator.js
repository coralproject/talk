import React, { Component } from 'react';
import { compose, gql } from 'react-apollo';
import Indicator from '../../../components/Indicator';
import { withFragments } from 'plugin-api/beta/client/hocs';
import { handleIndicatorChange, subscriptionFields } from '../graphql';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withQueueConfig from '../hoc/withQueueConfig';
import baseQueueConfig from '../queueConfig';
import Slot from 'coral-framework/components/Slot';

class IndicatorContainer extends Component {
  subscriptions = [];

  handleCommentChange = (root, comment) => {
    return handleIndicatorChange(root, comment, this.props.queueConfig);
  };

  subscribeToUpdates() {
    const parameters = [
      {
        document: COMMENT_ADDED_SUBSCRIPTION,
        updateQuery: (
          prev,
          {
            subscriptionData: {
              data: { commentAdded: comment },
            },
          }
        ) => {
          return this.handleCommentChange(prev, comment);
        },
      },
      {
        document: COMMENT_FLAGGED_SUBSCRIPTION,
        updateQuery: (
          prev,
          {
            subscriptionData: {
              data: { commentFlagged: comment },
            },
          }
        ) => {
          return this.handleCommentChange(prev, comment);
        },
      },
      {
        document: COMMENT_EDITED_SUBSCRIPTION,
        updateQuery: (
          prev,
          {
            subscriptionData: {
              data: { commentEdited: comment },
            },
          }
        ) => {
          return this.handleCommentChange(prev, comment);
        },
      },
      {
        document: COMMENT_ACCEPTED_SUBSCRIPTION,
        updateQuery: (
          prev,
          {
            subscriptionData: {
              data: { commentAccepted: comment },
            },
          }
        ) => {
          return this.handleCommentChange(prev, comment);
        },
      },
      {
        document: COMMENT_REJECTED_SUBSCRIPTION,
        updateQuery: (
          prev,
          {
            subscriptionData: {
              data: { commentRejected: comment },
            },
          }
        ) => {
          return this.handleCommentChange(prev, comment);
        },
      },
      {
        document: COMMENT_RESET_SUBSCRIPTION,
        updateQuery: (
          prev,
          {
            subscriptionData: {
              data: { commentReset: comment },
            },
          }
        ) => {
          return this.handleCommentChange(prev, comment);
        },
      },
    ];

    this.subscriptions = parameters.map(param =>
      this.props.data.subscribeToMore(param)
    );
  }

  unsubscribe() {
    this.subscriptions.forEach(unsubscribe => unsubscribe());
    this.subscriptions = [];
  }

  componentWillMount() {
    if (this.props.track) {
      this.subscribeToUpdates();
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.track && nextProps.track) {
      this.subscribeToUpdates();
    }
    if (this.props.track && !nextProps.track) {
      this.unsubscribe();
    }
  }

  render() {
    if (
      !this.props.root ||
      (!this.props.root.premodCount && !this.props.root.reportedCount)
    ) {
      return null;
    }

    const slotPassthrough = {
      handleCommentChange: this.handleCommentChange,
    };

    return (
      <span>
        <Indicator />
        <Slot fill="adminModerationIndicator" passthrough={slotPassthrough} />
      </span>
    );
  }
}

IndicatorContainer.propTypes = {
  data: PropTypes.object,
  root: PropTypes.object,
  track: PropTypes.bool,
  queueConfig: PropTypes.object,
};

const COMMENT_ADDED_SUBSCRIPTION = gql`
  subscription TalkAdmin_ModerationIndicator_CommentAdded {
    commentAdded(statuses: null) {
      ${subscriptionFields}
    }
  }
`;

const COMMENT_FLAGGED_SUBSCRIPTION = gql`
  subscription TalkAdmin_ModerationIndicator_CommentFlagged {
    commentFlagged {
      ${subscriptionFields}
    }
  }
`;

const COMMENT_EDITED_SUBSCRIPTION = gql`
  subscription TalkAdmin_ModerationIndicator_CommentEdited {
    commentEdited {
      ${subscriptionFields}
    }
  }
`;

const COMMENT_ACCEPTED_SUBSCRIPTION = gql`
  subscription TalkAdmin_ModerationIndicator_CommentAccepted {
    commentAccepted {
      ${subscriptionFields}
    }
  }
`;

const COMMENT_REJECTED_SUBSCRIPTION = gql`
  subscription TalkAdmin_ModerationIndicator_CommentRejected {
    commentRejected {
      ${subscriptionFields}
    }
  }
`;

const COMMENT_RESET_SUBSCRIPTION = gql`
  subscription TalkAdmin_ModerationIndicator_CommentReset {
    commentReset {
      ${subscriptionFields}
    }
  }
`;

const mapStateToProps = state => ({
  track: state.moderation.indicatorTrack,
});

const enhance = compose(
  connect(mapStateToProps),
  withFragments({
    root: gql`
      fragment TalkAdmin_Moderation_Indicator_root on RootQuery {
        premodCount: commentCount(
          query: { statuses: [PREMOD], asset_id: $nullID }
        )
        reportedCount: commentCount(
          query: {
            statuses: [NONE, PREMOD, SYSTEM_WITHHELD]
            action_type: FLAG
            asset_id: $nullID
          }
        )
      }
    `,
  }),
  withQueueConfig(baseQueueConfig)
);

export default enhance(IndicatorContainer);
