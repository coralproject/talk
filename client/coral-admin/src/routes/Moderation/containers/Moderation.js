import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, gql } from 'react-apollo';
import withQuery from 'coral-framework/hocs/withQuery';
import { getDefinitionName } from 'coral-framework/utils';
import t from 'coral-framework/services/i18n';
import update from 'immutability-helper';
import truncate from 'lodash/truncate';
import NotFoundAsset from '../components/NotFoundAsset';
import { isPremod, getModPath } from '../../../utils';

import { withSetCommentStatus } from 'coral-framework/graphql/mutations';
import {
  handleCommentChange,
  commentBelongToQueue,
  cleanUpQueue,
  subscriptionFields,
} from '../graphql';

import { viewUserDetail } from '../../../actions/userDetail';
import {
  toggleModal,
  singleView,
  hideShortcutsNote,
  toggleStorySearch,
  setSortOrder,
  storySearchChange,
  clearState,
  selectCommentId,
  setIndicatorTrack,
} from 'actions/moderation';
import withQueueConfig from '../hoc/withQueueConfig';
import { notify } from 'coral-framework/actions/notification';

import { Spinner } from 'coral-ui';
import Moderation from '../components/Moderation';
import Comment from './Comment';
import baseQueueConfig from '../queueConfig';

function prepareNotificationText(text) {
  return truncate(text, { length: 50 }).replace('\n', ' ');
}

function getAssetId(props) {
  if (props.params.tabOrId && !(props.params.tabOrId in props.queueConfig)) {
    return props.params.tabOrId;
  }
  return props.params.id || null;
}

function getTab(props) {
  if (props.params.tabOrId && props.params.tabOrId in props.queueConfig) {
    return props.params.tabOrId;
  }
  return props.params.tab || null;
}

class ModerationContainer extends Component {
  subscriptions = [];

  handleCommentChange = (root, comment, notifyText) => {
    return handleCommentChange(
      root,
      comment,
      this.props.data.variables.sortOrder,
      () => notifyText && this.props.notify('info', notifyText),
      this.props.queueConfig,
      this.activeTab
    );
  };

  get activeTab() {
    const {
      root: { asset, settings },
    } = this.props;
    const id = getAssetId(this.props);
    const tab = getTab(this.props);

    // Grab premod from asset or from settings if it's defined.
    const setting =
      id && asset && asset.settings
        ? asset.settings.moderation
        : settings.moderation;

    const queue = isPremod(setting) ? 'premod' : 'new';
    const activeTab = tab ? tab : queue;

    return activeTab;
  }

  subscribeToUpdates(variables = this.props.data.variables) {
    const parameters = [
      {
        document: COMMENT_ADDED_SUBSCRIPTION,
        variables,
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
        document: COMMENT_ACCEPTED_SUBSCRIPTION,
        variables,
        updateQuery: (
          prev,
          {
            subscriptionData: {
              data: { commentAccepted: comment },
            },
          }
        ) => {
          const user =
            comment.status_history[comment.status_history.length - 1]
              .assigned_by;
          const notifyText =
            this.props.currentUser.id === user.id
              ? ''
              : t(
                  'modqueue.notify_accepted',
                  user.username,
                  prepareNotificationText(comment.body)
                );
          return this.handleCommentChange(prev, comment, notifyText);
        },
      },
      {
        document: COMMENT_REJECTED_SUBSCRIPTION,
        variables,
        updateQuery: (
          prev,
          {
            subscriptionData: {
              data: { commentRejected: comment },
            },
          }
        ) => {
          const user =
            comment.status_history[comment.status_history.length - 1]
              .assigned_by;
          const notifyText =
            this.props.currentUser.id === user.id
              ? ''
              : t(
                  'modqueue.notify_rejected',
                  user.username,
                  prepareNotificationText(comment.body)
                );
          return this.handleCommentChange(prev, comment, notifyText);
        },
      },
      {
        document: COMMENT_RESET_SUBSCRIPTION,
        variables,
        updateQuery: (
          prev,
          {
            subscriptionData: {
              data: { commentReset: comment },
            },
          }
        ) => {
          const user =
            comment.status_history[comment.status_history.length - 1]
              .assigned_by;
          const notifyText =
            this.props.currentUser.id === user.id
              ? ''
              : t(
                  'modqueue.notify_reset',
                  user.username,
                  prepareNotificationText(comment.body)
                );
          return this.handleCommentChange(prev, comment, notifyText);
        },
      },
      {
        document: COMMENT_EDITED_SUBSCRIPTION,
        variables,
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
        document: COMMENT_FLAGGED_SUBSCRIPTION,
        variables,
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
    ];

    this.subscriptions = parameters.map(param =>
      this.props.data.subscribeToMoreThrottled(param)
    );
  }

  unsubscribe() {
    this.subscriptions.forEach(unsubscribe => unsubscribe());
    this.subscriptions = [];
  }

  resubscribe(variables) {
    this.unsubscribe();
    this.subscribeToUpdates(variables);
  }

  componentWillMount() {
    if (!this.props.data.variables.asset_id) {
      // Stop activity indicator tracking, as we'll handle it here.
      this.props.setIndicatorTrack(false);
    }
    this.props.clearState();
    this.subscribeToUpdates();
  }

  componentWillUnmount() {
    if (!this.props.data.variables.asset_id) {
      // Restart activity indicator tracking.
      this.props.setIndicatorTrack(true);
    }
    this.unsubscribe();
  }

  componentWillReceiveProps(nextProps) {
    const currentAssetId = this.props.data.variables.asset_id;
    const nextAssetId = nextProps.data.variables.asset_id;

    // Resubscribe when we change between assets.
    if (currentAssetId !== nextAssetId) {
      this.resubscribe(nextProps.data.variables);
    }

    // We are only subscribing to a specific asset_id, so activity indicator
    // needs to do its own tracking.
    if (!currentAssetId && nextAssetId) {
      this.props.setIndicatorTrack(true);
    }

    // We are subscribing to all comment changes, and as such there is no
    // need for the activity indicator to do the same.
    if (currentAssetId && !nextAssetId) {
      this.props.setIndicatorTrack(false);
    }
  }

  cleanUpQueue = queue => {
    if (!this.props.data.loading) {
      this.props.data.updateQuery(query => {
        return cleanUpQueue(
          query,
          queue,
          this.props.moderation.sortOrder,
          this.props.queueConfig
        );
      });
    }
  };

  acceptComment = ({ commentId }) => {
    return this.props.setCommentStatus({ commentId, status: 'ACCEPTED' });
  };

  rejectComment = ({ commentId }) => {
    return this.props.setCommentStatus({ commentId, status: 'REJECTED' });
  };

  commentBelongToQueue = (queue, comment) => {
    return commentBelongToQueue(queue, comment, this.props.queueConfig);
  };

  loadMore = tab => {
    const variables = {
      limit: 20,
      cursor: this.props.root[tab].endCursor,
      sortOrder: this.props.data.variables.sortOrder,
      asset_id: this.props.data.variables.asset_id,
      statuses: this.props.queueConfig[tab].statuses || null,
      tags: this.props.queueConfig[tab].tags || null,
      action_type: this.props.queueConfig[tab].action_type,
    };
    return this.props.data.fetchMore({
      query: LOAD_MORE_QUERY,
      variables,
      updateQuery: (prev, { fetchMoreResult: { comments } }) => {
        return update(prev, {
          [tab]: {
            nodes: { $push: comments.nodes },
            hasNextPage: { $set: comments.hasNextPage },
            endCursor: { $set: comments.endCursor },
          },
        });
      },
    });
  };

  render() {
    const {
      root,
      root: { asset, settings },
      data,
    } = this.props;
    const assetId = getAssetId(this.props);

    if (assetId) {
      if (asset === null) {
        // Not found.
        return <NotFoundAsset assetId={assetId} />;
      }
    }

    if (data.error) {
      return <div>{data.error.message}</div>;
    }

    if (data.loading && data.networkStatus !== 3) {
      // loading.
      return <Spinner />;
    }

    const premodEnabled = assetId
      ? isPremod(asset.settings.moderation)
      : isPremod(settings.moderation);

    const currentQueueConfig = Object.assign({}, this.props.queueConfig);

    if (premodEnabled && root.new.nodes.length === 0) {
      delete currentQueueConfig.new;
    }

    if (!premodEnabled && root.premod.nodes.length === 0) {
      delete currentQueueConfig.premod;
    }

    return (
      <Moderation
        {...this.props}
        getModPath={getModPath}
        loadMore={this.loadMore}
        acceptComment={this.acceptComment}
        rejectComment={this.rejectComment}
        activeTab={this.activeTab}
        queueConfig={currentQueueConfig}
        handleCommentChange={this.handleCommentChange}
        selectedCommentId={this.props.selectedCommentId}
        commentBelongToQueue={this.commentBelongToQueue}
        cleanUpQueue={this.cleanUpQueue}
      />
    );
  }
}

const COMMENT_ADDED_SUBSCRIPTION = gql`
  subscription CommentAdded($asset_id: ID){
    commentAdded(asset_id: $asset_id, statuses: null){
      ...${getDefinitionName(Comment.fragments.comment)}
      ${subscriptionFields}
    }
  }
  ${Comment.fragments.comment}
`;

const COMMENT_EDITED_SUBSCRIPTION = gql`
  subscription CommentEdited($asset_id: ID){
    commentEdited(asset_id: $asset_id){
      ...${getDefinitionName(Comment.fragments.comment)}
      ${subscriptionFields}
    }
  }
  ${Comment.fragments.comment}
`;

const COMMENT_FLAGGED_SUBSCRIPTION = gql`
  subscription CommentFlagged($asset_id: ID){
    commentFlagged(asset_id: $asset_id){
      ...${getDefinitionName(Comment.fragments.comment)}
      ${subscriptionFields}
    }
  }
  ${Comment.fragments.comment}
`;

const COMMENT_ACCEPTED_SUBSCRIPTION = gql`
  subscription CommentAccepted($asset_id: ID){
    commentAccepted(asset_id: $asset_id){
      ...${getDefinitionName(Comment.fragments.comment)}
      ${subscriptionFields}
    }
  }
  ${Comment.fragments.comment}
`;

const COMMENT_REJECTED_SUBSCRIPTION = gql`
  subscription CommentRejected($asset_id: ID){
    commentRejected(asset_id: $asset_id){
      ...${getDefinitionName(Comment.fragments.comment)}
      ${subscriptionFields}
    }
  }
  ${Comment.fragments.comment}
`;

const COMMENT_RESET_SUBSCRIPTION = gql`
  subscription CommentReset($asset_id: ID){
    commentReset(asset_id: $asset_id){
      ...${getDefinitionName(Comment.fragments.comment)}
      ${subscriptionFields}
    }
  }
  ${Comment.fragments.comment}
`;

const LOAD_MORE_QUERY = gql`
  query CoralAdmin_Moderation_LoadMore($limit: Int = 10, $cursor: Cursor, $sortOrder: SORT_ORDER, $asset_id: ID, $tags:[String!], $statuses:[COMMENT_STATUS!], $action_type: ACTION_TYPE) {
    comments(query: {limit: $limit, cursor: $cursor, asset_id: $asset_id, statuses: $statuses, sortOrder: $sortOrder, action_type: $action_type, tags: $tags, excludeDeleted: true}) {
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

const withModQueueQuery = withQuery(
  ({ queueConfig }) => gql`
  query CoralAdmin_Moderation($asset_id: ID, $sortOrder: SORT_ORDER, $allAssets: Boolean!, $nullStatuses: [COMMENT_STATUS!]) {
    ${Object.keys(queueConfig).map(
      queue => `
      ${queue}: comments(query: {
        excludeDeleted: true,
        statuses: ${
          queueConfig[queue].statuses
            ? `[${queueConfig[queue].statuses.join(', ')}],`
            : '$nullStatuses'
        }
        ${
          queueConfig[queue].tags
            ? `tags: ["${queueConfig[queue].tags.join('", "')}"],`
            : ''
        }
        ${
          queueConfig[queue].action_type
            ? `action_type: ${queueConfig[queue].action_type}`
            : ''
        }
        asset_id: $asset_id,
        sortOrder: $sortOrder,
        limit: 20,
      }) {
        ...CoralAdmin_Moderation_CommentConnection
      }
    `
    )}
    ${
      ''
      /*
     TODO: eventually we'll reintroduce counting..
     Object.keys(queueConfig).map(
      queue => `
      ${queue}Count: commentCount(query: {
        excludeDeleted: true,
        statuses: ${
          queueConfig[queue].statuses
            ? `[${queueConfig[queue].statuses.join(', ')}],`
            : '$nullStatuses'
        }
        ${
          queueConfig[queue].tags
            ? `tags: ["${queueConfig[queue].tags.join('", "')}"],`
            : ''
        }
        ${
          queueConfig[queue].action_type
            ? `action_type: ${queueConfig[queue].action_type}`
            : ''
        }
        asset_id: $asset_id,
      })
    `
    )*/
    }
    asset(id: $asset_id) @skip(if: $allAssets) {
      id
      title
      url
      settings {
        moderation
      }
    }
    settings {
      organizationName
      moderation
    }
    me {
      id
    }
    ...${getDefinitionName(Comment.fragments.root)}
  }
  ${Comment.fragments.root}
  ${commentConnectionFragment}
`,
  {
    options: props => {
      const id = getAssetId(props);
      return {
        variables: {
          asset_id: id,
          sortOrder: props.moderation.sortOrder,
          allAssets: id === null,
          nullStatuses: null,
        },
        fetchPolicy: 'network-only',
      };
    },
  }
);

const mapStateToProps = state => ({
  moderation: state.moderation,
  currentUser: state.auth.user,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      toggleModal,
      singleView,
      hideShortcutsNote,
      toggleStorySearch,
      viewUserDetail,
      setSortOrder,
      storySearchChange,
      clearState,
      notify,
      selectCommentId,
      setIndicatorTrack,
    },
    dispatch
  ),
});

export default compose(
  withQueueConfig(baseQueueConfig),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withSetCommentStatus,
  withModQueueQuery
)(ModerationContainer);
