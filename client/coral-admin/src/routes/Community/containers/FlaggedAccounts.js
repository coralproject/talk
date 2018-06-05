import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, gql } from 'react-apollo';
import withQuery from 'coral-framework/hocs/withQuery';
import { Spinner } from 'coral-ui';
import PropTypes from 'prop-types';
import { withApproveUsername } from 'coral-framework/graphql/mutations';
import {
  showRejectUsernameDialog,
  setIndicatorTrack,
} from '../../../actions/community';
import { viewUserDetail } from '../../../actions/userDetail';
import { getDefinitionName } from 'coral-framework/utils';
import { appendNewNodes } from 'plugin-api/beta/client/utils';
import update from 'immutability-helper';
import { handleFlaggedAccountsChange } from '../graphql';
import { notify } from 'coral-framework/actions/notification';
import { isFlaggedUserDangling } from '../utils';
import t from 'coral-framework/services/i18n';

import FlaggedAccounts from '../components/FlaggedAccounts';
import FlaggedUser from '../containers/FlaggedUser';

function whoChangedTheStatus(statusObject) {
  return statusObject.history[statusObject.history.length - 1].assigned_by
    .username;
}

function whoFlagged(user) {
  return user.actions[user.actions.length - 1].user.username;
}

class FlaggedAccountsContainer extends Component {
  subscriptions = [];

  getCountWithoutDangling() {
    return this.props.root.flaggedUsers.nodes.filter(
      node => !isFlaggedUserDangling(node)
    ).length;
  }

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
          return handleFlaggedAccountsChange(prev, user, () => {
            const msg = t(
              'flagged_usernames.notify_flagged',
              whoFlagged(user),
              user.username
            );
            this.props.notify('info', msg);
          });
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
          return handleFlaggedAccountsChange(prev, user, () => {
            const msg = t(
              'flagged_usernames.notify_approved',
              whoChangedTheStatus(user.state.status.username),
              user.username
            );
            this.props.notify('info', msg);
          });
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
          return handleFlaggedAccountsChange(prev, user, () => {
            const msg = t(
              'flagged_usernames.notify_rejected',
              whoChangedTheStatus(user.state.status.username),
              user.username
            );
            this.props.notify('info', msg);
          });
        },
      },
      {
        document: USERNAME_CHANGED_SUBSCRIPTION,
        updateQuery: (
          prev,
          {
            subscriptionData: {
              data: {
                usernameChanged: { previousUsername, user },
              },
            },
          }
        ) => {
          return handleFlaggedAccountsChange(prev, user, () => {
            const msg = t(
              'flagged_usernames.notify_changed',
              previousUsername,
              user.username
            );
            this.props.notify('info', msg);
          });
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
    // Stop activity indicator tracking, as we'll handle it here.
    this.props.setIndicatorTrack(false);
    this.subscribeToUpdates();
  }

  componentWillUnmount() {
    // Restart activity indicator tracking.
    this.props.setIndicatorTrack(true);
    this.unsubscribe();
  }

  approveUser = ({ userId: id }) => {
    return this.props.approveUsername(id);
  };

  loadMore = () => {
    return this.props.data.fetchMore({
      query: LOAD_MORE_QUERY,
      variables: {
        limit: 5,
        cursor: this.props.root.flaggedUsers.endCursor,
      },
      updateQuery: (previous, { fetchMoreResult: { flaggedUsers } }) => {
        const updated = update(previous, {
          flaggedUsers: {
            nodes: {
              $apply: nodes => appendNewNodes(nodes, flaggedUsers.nodes),
            },
            hasNextPage: { $set: flaggedUsers.hasNextPage },
            endCursor: { $set: flaggedUsers.endCursor },
          },
        });
        return updated;
      },
    });
  };

  render() {
    if (this.props.data.error) {
      return <div>{this.props.data.error.message}</div>;
    }

    if (this.props.data.loading) {
      return (
        <div>
          <Spinner />
        </div>
      );
    }

    return (
      <FlaggedAccounts
        showRejectUsernameDialog={this.props.showRejectUsernameDialog}
        viewUserDetail={this.props.viewUserDetail}
        approveUser={this.approveUser}
        loadMore={this.loadMore}
        data={this.props.data}
        root={this.props.root}
        users={this.props.root.flaggedUsers}
        hasMore={
          this.getCountWithoutDangling() < this.props.root.flaggedUsernamesCount
        }
        me={this.props.root.me}
      />
    );
  }
}

FlaggedAccountsContainer.propTypes = {
  showRejectUsernameDialog: PropTypes.func,
  viewUserDetail: PropTypes.func,
  notify: PropTypes.func,
  flaggedUsernamesCount: PropTypes.number,
  approveUsername: PropTypes.func,
  data: PropTypes.object,
  root: PropTypes.object,
  setIndicatorTrack: PropTypes.func,
};

const LOAD_MORE_QUERY = gql`
  query TalkAdmin_LoadMoreFlaggedAccounts($limit: Int, $cursor: Cursor) {
    flaggedUsers: users(query:{
        action_type: FLAG,
        state: {
          status: {
            username: [SET, CHANGED]
          }
        },
        limit: $limit,
        cursor: $cursor
      }){
      hasNextPage
      endCursor
      nodes {
        __typename
        ...${getDefinitionName(FlaggedUser.fragments.user)}
      }
    }
  }
  ${FlaggedUser.fragments.user}
`;

const historyFields = `
  state {
    status {
      username {
        history {
          status
          assigned_by {
            id
            username
          }
          created_at
        }
      }
    }
  }
`;

const USERNAME_FLAGGED_SUBSCRIPTION = gql`
  subscription TalkAdmin_UsernameFlagged {
    usernameFlagged {
      ...${getDefinitionName(FlaggedUser.fragments.user)}
      ${historyFields}
    }
  }
  ${FlaggedUser.fragments.user}
`;

const USERNAME_APPROVED_SUBSCRIPTION = gql`
  subscription TalkAdmin_UsernameApproved {
    usernameApproved {
      ...${getDefinitionName(FlaggedUser.fragments.user)}
      ${historyFields}
    }
  }
  ${FlaggedUser.fragments.user}
`;

const USERNAME_REJECTED_SUBSCRIPTION = gql`
  subscription TalkAdmin_UsernameRejected {
    usernameRejected {
      ...${getDefinitionName(FlaggedUser.fragments.user)}
      ${historyFields}
    }
  }
  ${FlaggedUser.fragments.user}
`;

const USERNAME_CHANGED_SUBSCRIPTION = gql`
  subscription TalkAdmin_UsernameChanged {
    usernameChanged {
      previousUsername
      user {
        ...${getDefinitionName(FlaggedUser.fragments.user)}
        ${historyFields}
      }
    }
  }
  ${FlaggedUser.fragments.user}
`;

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      showRejectUsernameDialog,
      viewUserDetail,
      notify,
      setIndicatorTrack,
    },
    dispatch
  );

export default compose(
  connect(
    null,
    mapDispatchToProps
  ),
  withApproveUsername,
  withQuery(
    gql`
      query TalkAdmin_Community_FlaggedAccounts {
        flaggedUsernamesCount: userCount(
          query: {
            action_type: FLAG
            state: { status: { username: [SET, CHANGED] } }
          }
        )
        flaggedUsers: users(query:{
            action_type: FLAG,
            state: {
              status: {
                username: [SET, CHANGED]
              }
            }
            limit: 10
          }){
          hasNextPage
          endCursor
          nodes {
            __typename
            ...${getDefinitionName(FlaggedUser.fragments.user)}
          }
        }
        me {
          id
          ...${getDefinitionName(FlaggedUser.fragments.me)}
        }
      }
      ${FlaggedUser.fragments.user}
      ${FlaggedUser.fragments.me}
    `,
    {
      options: {
        fetchPolicy: 'network-only',
      },
    }
  )
)(FlaggedAccountsContainer);
