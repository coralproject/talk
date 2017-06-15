import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {compose, gql} from 'react-apollo';
import isEqual from 'lodash/isEqual';
import withQuery from 'coral-framework/hocs/withQuery';
import {getDefinitionName} from 'coral-framework/utils';
import * as notification from 'coral-admin/src/services/notification';
import t, {timeago} from 'coral-framework/services/i18n';
import update from 'immutability-helper';

import {withSetUserStatus, withSuspendUser, withSetCommentStatus} from 'coral-framework/graphql/mutations';
import {handleCommentStatusChange} from '../../../graphql/utils';

import {fetchSettings} from 'actions/settings';
import {updateAssets} from 'actions/assets';
import {
  toggleModal,
  singleView,
  showBanUserDialog,
  hideBanUserDialog,
  showSuspendUserDialog,
  hideSuspendUserDialog,
  hideShortcutsNote,
  viewUserDetail,
  hideUserDetail,
  setSortOrder,
} from 'actions/moderation';

import {Spinner} from 'coral-ui';
import Moderation from '../components/Moderation';
import Comment from './Comment';

class ModerationContainer extends Component {
  unsubscribe = null;

  get activeTab() { return this.props.route.path === ':id' ? 'premod' : this.props.route.path; }

  subscribeToUpdates() {
    this.unsubscribe = this.props.data.subscribeToMore({
      document: STATUS_CHANGED_SUBSCRIPTION,
      variables: {
        asset_id: this.props.data.variables.asset_id,
      },
      updateQuery: (prev, {subscriptionData: {data: {commentStatusChanged: {user, comment, previous}}}}) => {
        const extraParams = this.props.auth.user.id === user.id
          ? {}
          : {
            notify: true,
            user,
            activeQueue: this.activeTab,
            previous,
          };
        return handleCommentStatusChange(prev, comment, {
          sort: this.props.moderation.sortOrder,
          ...extraParams,
        });
      },
    });
  }

  unsubscribe() {
    if (!this.unsubscribe) {
      return;
    }
    this.unsubscribe();
    this.unsubscribe = null;
  }

  resubscribe() {
    this.unsubscribe();
    this.subscribeToUpdates();
  }

  componentWillMount() {
    this.props.fetchSettings();
    this.subscribeToUpdates();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  componentWillReceiveProps(nextProps) {
    const {updateAssets} = this.props;
    if(!isEqual(nextProps.root.assets, this.props.root.assets)) {
      updateAssets(nextProps.root.assets);
    }

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

const STATUS_CHANGED_SUBSCRIPTION = gql`
  subscription CommentStatusChanged($asset_id: ID){
    commentStatusChanged(asset_id: $asset_id){
      user {
        id
        username
      }
      comment {
        id
        status
        body
        created_at
        action_summaries {
          count
          ... on FlagActionSummary {
            reason
          }
        }
        actions {
          ... on FlagAction {
            reason
            message
            user {
              username
            }
          }
        }
      }
      previous {
        status
      }
    }
  }
`;

const LOAD_MORE_QUERY = gql`
  query CoralAdmin_Moderation_LoadMore($limit: Int = 10, $cursor: Date, $sort: SORT_ORDER, $asset_id: ID, $statuses:[COMMENT_STATUS!], $action_type: ACTION_TYPE) {
    comments(query: {limit: $limit, cursor: $cursor, asset_id: $asset_id, statuses: $statuses, sort: $sort, action_type: $action_type}) {
      nodes {
        ...${getDefinitionName(Comment.fragments.comment)}
        action_summaries {
          count
          ... on FlagActionSummary {
            reason
          }
        }
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
  query CoralAdmin_Moderation($asset_id: ID, $sort: SORT_ORDER) {
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
    assets: assets {
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
  assets: state.assets.get('assets')
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    toggleModal,
    singleView,
    updateAssets,
    fetchSettings,
    showBanUserDialog,
    hideBanUserDialog,
    hideShortcutsNote,
    showSuspendUserDialog,
    hideSuspendUserDialog,
    viewUserDetail,
    hideUserDetail,
    setSortOrder,
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
