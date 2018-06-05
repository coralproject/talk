import React, { Component } from 'react';
import { compose, gql } from 'react-apollo';
import Indicator from '../../../components/Indicator';
import { withFragments } from 'plugin-api/beta/client/hocs';
import { handleIndicatorChange } from '../graphql';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class IndicatorContainer extends Component {
  subscriptions = [];

  subscribeToUpdates() {
    const parameters = [
      {
        document: USERNAME_FLAGGED_SUBSCRIPTION,
        updateQuery: (
          prev,
          {
            subscriptionData: {
              data: { usernameFlagged: user },
            },
          }
        ) => {
          return handleIndicatorChange(prev, user);
        },
      },
      {
        document: USERNAME_APPROVED_SUBSCRIPTION,
        updateQuery: (
          prev,
          {
            subscriptionData: {
              data: { usernameApproved: user },
            },
          }
        ) => {
          return handleIndicatorChange(prev, user);
        },
      },
      {
        document: USERNAME_REJECTED_SUBSCRIPTION,
        updateQuery: (
          prev,
          {
            subscriptionData: {
              data: { usernameRejected: user },
            },
          }
        ) => {
          return handleIndicatorChange(prev, user);
        },
      },
      {
        document: USERNAME_CHANGED_SUBSCRIPTION,
        updateQuery: (
          prev,
          {
            subscriptionData: {
              data: {
                usernameChanged: { user },
              },
            },
          }
        ) => {
          return handleIndicatorChange(prev, user);
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
    if (!this.props.root || !this.props.root.flaggedUsernamesCount) {
      return null;
    }

    return <Indicator />;
  }
}

IndicatorContainer.propTypes = {
  data: PropTypes.object,
  root: PropTypes.object,
  track: PropTypes.bool,
};

const fields = `
  state {
    status {
      username {
        status
        history {
          status
        }
      }
    }
  }
  action_summaries {
    count
  }
`;

const USERNAME_FLAGGED_SUBSCRIPTION = gql`
  subscription TalkAdmin_CommunityIndicator_UsernameFlagged {
    usernameFlagged {
      ${fields}
    }
  }
`;

const USERNAME_APPROVED_SUBSCRIPTION = gql`
  subscription TalkAdmin_ComunityIndicator_UsernameApproved {
    usernameApproved {
      ${fields}
    }
  }
`;

const USERNAME_REJECTED_SUBSCRIPTION = gql`
  subscription TalkAdmin_CommunityIndicator_UsernameRejected {
    usernameRejected {
      ${fields}
    }
  }
`;

const USERNAME_CHANGED_SUBSCRIPTION = gql`
  subscription TalkAdmin_ComunityIndicator_UsernameChanged {
    usernameChanged {
      previousUsername
      user {
        ${fields}
      }
    }
  }
`;

const mapStateToProps = state => ({
  track: state.community.indicatorTrack,
});

const enhance = compose(
  connect(mapStateToProps),
  withFragments({
    root: gql`
      fragment TalkAdmin_CommunityIndicator_root on RootQuery {
        flaggedUsernamesCount: userCount(
          query: {
            action_type: FLAG
            state: { status: { username: [SET, CHANGED] } }
          }
        )
      }
    `,
  })
);

export default enhance(IndicatorContainer);
