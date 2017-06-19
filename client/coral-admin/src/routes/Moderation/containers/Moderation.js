import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {compose, gql} from 'react-apollo';
import withQuery from 'coral-framework/hocs/withQuery';
import {getDefinitionName} from 'coral-framework/utils';
import * as notification from 'coral-admin/src/services/notification';
import t, {timeago} from 'coral-framework/services/i18n';
import update from 'immutability-helper';
import truncate from 'lodash/truncate';

import {withSetUserStatus, withSuspendUser, withSetCommentStatus} from 'coral-framework/graphql/mutations';
import {handleCommentChange} from '../../../graphql/utils';

import {fetchSettings} from 'actions/settings';
import {
  toggleModal,
  singleView,
  showBanUserDialog,
  hideBanUserDialog,
  showSuspendUserDialog,
  hideSuspendUserDialog,
  hideShortcutsNote,
  toggleStorySearch,
  viewUserDetail,
  hideUserDetail,
  setSortOrder,
  storySearchChange,
  clearState
} from 'actions/moderation';

import {Spinner} from 'coral-ui';
import Moderation from '../components/Moderation';
import Comment from './Comment';

class ModerationContainer extends Component {
  subscriptions = [];

  get activeTab() { return this.props.route.path === ':id' ? 'premod' : this.props.route.path; }

  subscribeToUpdates() {
    const sub1 = this.props.data.subscribeToMore({
      document: COMMENT_ACCEPTED_SUBSCRIPTION,
      variables: {
        asset_id: this.props.data.variables.asset_id,
      },
      updateQuery: (prev, {subscriptionData: {data: {commentAccepted: comment}}}) => {
        const user = comment.status_history[comment.status_history.length - 1].assigned_by;
        const sort = this.props.moderation.sortOrder;
        const notify = this.props.auth.user.id === user.id
          ? {}
          : {
            activeQueue: this.activeTab,
            text: `${user.username} accepted comment "${truncate(comment.body, {lenght: 50})}"`,
            anyQueue: false,
          };
        return handleCommentChange(prev, comment, sort, notify);
      },
    });

    const sub2 = this.props.data.subscribeToMore({
      document: COMMENT_REJECTED_SUBSCRIPTION,
      variables: {
        asset_id: this.props.data.variables.asset_id,
      },
      updateQuery: (prev, {subscriptionData: {data: {commentRejected: comment}}}) => {
        const user = comment.status_history[comment.status_history.length - 1].assigned_by;
        const sort = this.props.moderation.sortOrder;
        const notify = this.props.auth.user.id === user.id
          ? {}
          : {
            activeQueue: this.activeTab,
            text: `${user.username} rejected comment "${truncate(comment.body, {lenght: 50})}"`,
            anyQueue: false,
          };
        return handleCommentChange(prev, comment, sort, notify);
      },
    });

    const sub3 = this.props.data.subscribeToMore({
      document: COMMENT_EDITED_SUBSCRIPTION,
      variables: {
        asset_id: this.props.data.variables.asset_id,
      },
      updateQuery: (prev, {subscriptionData: {data: {commentEdited: comment}}}) => {
        const sort = this.props.moderation.sortOrder;
        const notify = {
          activeQueue: this.activeTab,
          text: `${comment.user.username} edited comment to "${truncate(comment.body, {lenght: 50})}"`,
          anyQueue: false,
        };
        return handleCommentChange(prev, comment, sort, notify);
      },
    });

    const sub4 = this.props.data.subscribeToMore({
      document: COMMENT_FLAGGED_SUBSCRIPTION,
      variables: {
        asset_id: this.props.data.variables.asset_id,
      },
      updateQuery: (prev, {subscriptionData: {data: {commentFlagged: comment}}}) => {
        const user = comment.actions[comment.actions.length - 1].user;
        const sort = this.props.moderation.sortOrder;
        const notify = {
          activeQueue: this.activeTab,
          text: `${user.username} flagged comment "${truncate(comment.body, {lenght: 50})}"`,
          anyQueue: true,
        };
        return handleCommentChange(prev, comment, sort, notify);
      },
    });

    this.subscriptions.push(sub1, sub2, sub3, sub4);
  }

  unsubscribe() {
    this.subscriptions.forEach((unsubscribe) => unsubscribe());
    this.subscriptions = [];
  }

  resubscribe() {
    this.unsubscribe();
    this.subscribeToUpdates();
  }

  componentWillMount() {
    this.props.clearState();
    this.props.fetchSettings();
    this.subscribeToUpdates();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  componentWillReceiveProps(nextProps) {
    // Resubscribe when we change between assets.
    if(this.props.data.variables.asset_id !== nextProps.data.variables.asset_id) {
      this.resubscribe();
    }
  }

  suspendUser = async (args) => {
    this.props.hideSuspendUserDialog();
    try {
      const result = await this.props.suspendUser(args);
      if (result.data.suspendUser.errors) {
        throw result.data.suspendUser.errors;
      }
      notification.success(
        t('suspenduser.notify_suspend_until',
          this.props.moderation.suspendUserDialog.username,
          timeago(args.until)),
      );
      const {commentStatus, commentId} = this.props.moderation.suspendUserDialog;
      if (commentStatus !== 'REJECTED') {
        return this.props.rejectComment({commentId})
          .then((result) => {
            if (result.data.setCommentStatus.errors) {
              throw result.data.setCommentStatus.errors;
            }
          });
      }
    }
    catch(err) {
      notification.showMutationErrors(err);
    }
  };

  banUser = ({userId}) => {
    return this.props.setUserStatus({userId, status: 'BANNED'});
  }

  acceptComment = ({commentId}) => {
    return this.props.setCommentStatus({commentId, status: 'ACCEPTED'});
  }

  rejectComment = ({commentId}) => {
    return this.props.setCommentStatus({commentId, status: 'REJECTED'});
  }

  loadMore = (tab) => {
    const variables = {
      limit: 10,
      cursor: this.props.root[tab].endCursor,
      sort: this.props.data.variables.sort,
      asset_id: this.props.data.variables.asset_id,
    };
    switch(tab) {
    case 'all':
      variables.statuses = null;
      break;
    case 'accepted':
      variables.statuses = ['ACCEPTED'];
      break;
    case 'premod':
      variables.statuses = ['PREMOD'];
      break;
    case 'flagged':
      variables.statuses = ['NONE', 'PREMOD'];
      variables.action_type = 'FLAG';
      break;
    case 'rejected':
      variables.statuses = ['REJECTED'];
      break;
    }
    return this.props.data.fetchMore({
      query: LOAD_MORE_QUERY,
      variables,
      updateQuery: (prev, {fetchMoreResult:{comments}}) => {
        return update(prev, {
          [tab]: {
            nodes: {$push: comments.nodes},
            hasNextPage: {$set: comments.hasNextPage},
            startCursor: {$set: comments.startCursor},
            endCursor: {$set: comments.endCursor},
          },
        });
      }
    });
  };

  render () {
    const {root, data} = this.props;

    if (data.error) {
      return <div>Error</div>;
    }

    if (!('premodCount' in root)) {
      return <div><Spinner/></div>;
    }

    return <Moderation
      {...this.props}
      loadMore={this.loadMore}
      banUser={this.banUser}
      acceptComment={this.acceptComment}
      rejectComment={this.rejectComment}
      suspendUser={this.suspendUser}
      activeTab={this.activeTab}
    />;
  }
}

const COMMENT_EDITED_SUBSCRIPTION = gql`
  subscription CommentEdited($asset_id: ID){
    commentEdited(asset_id: $asset_id){
      ...${getDefinitionName(Comment.fragments.comment)}
    }
  }
  ${Comment.fragments.comment}
`;

const COMMENT_FLAGGED_SUBSCRIPTION = gql`
  subscription CommentFlagged($asset_id: ID){
    commentFlagged(asset_id: $asset_id){
      ...${getDefinitionName(Comment.fragments.comment)}
    }
  }
  ${Comment.fragments.comment}
`;

const COMMENT_ACCEPTED_SUBSCRIPTION = gql`
  subscription CommentAccepted($asset_id: ID){
    commentAccepted(asset_id: $asset_id){
      ...${getDefinitionName(Comment.fragments.comment)}
      status_history {
        type
        created_at
        assigned_by {
          id
          username
        }
      }
    }
  }
  ${Comment.fragments.comment}
`;

const COMMENT_REJECTED_SUBSCRIPTION = gql`
  subscription CommentRejected($asset_id: ID){
    commentRejected(asset_id: $asset_id){
      ...${getDefinitionName(Comment.fragments.comment)}
      status_history {
        type
        created_at
        assigned_by {
          id
          username
        }
      }
    }
  }
  ${Comment.fragments.comment}
`;

const LOAD_MORE_QUERY = gql`
  query CoralAdmin_Moderation_LoadMore($limit: Int = 10, $cursor: Date, $sort: SORT_ORDER, $asset_id: ID, $statuses:[COMMENT_STATUS!], $action_type: ACTION_TYPE) {
    comments(query: {limit: $limit, cursor: $cursor, asset_id: $asset_id, statuses: $statuses, sort: $sort, action_type: $action_type}) {
      nodes {
        ...${getDefinitionName(Comment.fragments.comment)}
      }
      hasNextPage
      startCursor
      endCursor
    }
  }
  ${Comment.fragments.comment}
`;

const commentConnectionFragment = gql`
  fragment CoralAdmin_Moderation_CommentConnection on CommentConnection {
    nodes {
      ...${getDefinitionName(Comment.fragments.comment)}
    }
    hasNextPage
    startCursor
    endCursor
  }
  ${Comment.fragments.comment}
`;

const withModQueueQuery = withQuery(gql`
  query CoralAdmin_Moderation($asset_id: ID, $sort: SORT_ORDER, $allAssets: Boolean!) {
    all: comments(query: {
      statuses: [NONE, PREMOD, ACCEPTED, REJECTED],
      asset_id: $asset_id,
      sort: $sort
    }) {
      ...CoralAdmin_Moderation_CommentConnection
    }
    accepted: comments(query: {
      statuses: [ACCEPTED],
      asset_id: $asset_id,
      sort: $sort
    }) {
      ...CoralAdmin_Moderation_CommentConnection
    }
    premod: comments(query: {
        statuses: [PREMOD],
        asset_id: $asset_id,
        sort: $sort
    }) {
      ...CoralAdmin_Moderation_CommentConnection
    }
    flagged: comments(query: {
        action_type: FLAG,
        asset_id: $asset_id,
        statuses: [NONE, PREMOD],
        sort: $sort
    }) {
      ...CoralAdmin_Moderation_CommentConnection
    }
    rejected: comments(query: {
        statuses: [REJECTED],
        asset_id: $asset_id,
        sort: $sort
    }) {
      ...CoralAdmin_Moderation_CommentConnection
    }
    asset(id: $asset_id) @skip(if: $allAssets) {
      id
      title
      url
    }
    allCount: commentCount(query: {
      asset_id: $asset_id
    })
    acceptedCount: commentCount(query: {
      statuses: [ACCEPTED],
      asset_id: $asset_id
    })
    premodCount: commentCount(query: {
      statuses: [PREMOD],
      asset_id: $asset_id
    })
    rejectedCount: commentCount(query: {
       statuses: [REJECTED],
       asset_id: $asset_id
    })
    flaggedCount: commentCount(query: {
      action_type: FLAG,
      asset_id: $asset_id,
      statuses: [NONE, PREMOD]
    })
    settings {
      organizationName
    }
  }
  ${commentConnectionFragment}
`, {
  options: ({params: {id = null}, moderation: {sortOrder}}) => {
    return {
      variables: {
        asset_id: id,
        sort: sortOrder,
        allAssets: id === null
      }
    };
  },
});

const withQueueCountPolling = withQuery(gql`
  query CoralAdmin_ModerationCountPoll($asset_id: ID) {
    allCount: commentCount(query: {
      asset_id: $asset_id
    })
    acceptedCount: commentCount(query: {
      statuses: [ACCEPTED],
      asset_id: $asset_id
    })
    premodCount: commentCount(query: {
      statuses: [PREMOD],
      asset_id: $asset_id
    })
    rejectedCount: commentCount(query: {
       statuses: [REJECTED],
       asset_id: $asset_id
    })
    flaggedCount: commentCount(query: {
      action_type: FLAG,
      asset_id: $asset_id,
      statuses: [NONE, PREMOD]
    })
  }
`, {
  options: ({params: {id = null}}) => {
    return {
      pollInterval: 5000,
      variables: {
        asset_id: id
      }
    };
  }
});

const mapStateToProps = (state) => ({
  moderation: state.moderation.toJS(),
  settings: state.settings.toJS(),
  auth: state.auth.toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    toggleModal,
    singleView,
    fetchSettings,
    showBanUserDialog,
    hideBanUserDialog,
    hideShortcutsNote,
    toggleStorySearch,
    showSuspendUserDialog,
    hideSuspendUserDialog,
    viewUserDetail,
    hideUserDetail,
    setSortOrder,
    storySearchChange,
    clearState
  }, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withSetCommentStatus,
  withSetUserStatus,
  withSuspendUser,
  withQueueCountPolling,
  withModQueueQuery,
)(ModerationContainer);
