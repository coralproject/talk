import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {compose, gql} from 'react-apollo';
import withQuery from 'coral-framework/hocs/withQuery';
import {getDefinitionName} from 'coral-framework/utils';
import t from 'coral-framework/services/i18n';
import update from 'immutability-helper';
import truncate from 'lodash/truncate';
import NotFoundAsset from '../components/NotFoundAsset';
import {isPremod, getModPath} from '../../../utils';

import {withSetCommentStatus} from 'coral-framework/graphql/mutations';
import {handleCommentChange} from '../graphql';

import {fetchSettings} from 'actions/settings';
import {showBanUserDialog} from 'actions/banUserDialog';
import {showSuspendUserDialog} from 'actions/suspendUserDialog';
import {viewUserDetail} from '../../../actions/userDetail';
import {
  toggleModal,
  singleView,
  hideShortcutsNote,
  toggleStorySearch,
  setSortOrder,
  storySearchChange,
  clearState
} from 'actions/moderation';
import withQueueConfig from '../hoc/withQueueConfig';
import {notify} from 'coral-framework/actions/notification';

import {Spinner} from 'coral-ui';
import Moderation from '../components/Moderation';
import Comment from './Comment';
import baseQueueConfig from '../queueConfig';

function prepareNotificationText(text) {
  return truncate(text, {length: 50}).replace('\n', ' ');
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

    const {root: {asset, settings}} = this.props;
    const id = getAssetId(this.props);
    const tab = getTab(this.props);

    // Grab premod from asset or from settings
    const premod = !id ? settings.moderation : asset.settings.moderation;

    const queue = isPremod(premod) ? 'premod' : 'new';
    const activeTab = tab ? tab : queue;

    return activeTab;
  }

  subscribeToUpdates(variables = this.props.data.variables) {
    const sub1 = this.props.data.subscribeToMore({
      document: COMMENT_ACCEPTED_SUBSCRIPTION,
      variables,
      updateQuery: (prev, {subscriptionData: {data: {commentAccepted: comment}}}) => {
        const user = comment.status_history[comment.status_history.length - 1].assigned_by;
        const notifyText = this.props.auth.user.id === user.id
          ? ''
          : t('modqueue.notify_accepted', user.username, prepareNotificationText(comment.body));
        return this.handleCommentChange(prev, comment, notifyText);
      },
    });

    const sub2 = this.props.data.subscribeToMore({
      document: COMMENT_REJECTED_SUBSCRIPTION,
      variables,
      updateQuery: (prev, {subscriptionData: {data: {commentRejected: comment}}}) => {
        const user = comment.status_history[comment.status_history.length - 1].assigned_by;
        const notifyText = this.props.auth.user.id === user.id
          ? ''
          : t('modqueue.notify_rejected', user.username, prepareNotificationText(comment.body));
        return this.handleCommentChange(prev, comment, notifyText);
      },
    });

    const sub3 = this.props.data.subscribeToMore({
      document: COMMENT_EDITED_SUBSCRIPTION,
      variables,
      updateQuery: (prev, {subscriptionData: {data: {commentEdited: comment}}}) => {
        const notifyText = t('modqueue.notify_edited', comment.user.username, prepareNotificationText(comment.body));
        return this.handleCommentChange(prev, comment, notifyText);
      },
    });

    const sub4 = this.props.data.subscribeToMore({
      document: COMMENT_FLAGGED_SUBSCRIPTION,
      variables,
      updateQuery: (prev, {subscriptionData: {data: {commentFlagged: comment}}}) => {
        const user = comment.actions[comment.actions.length - 1].user;
        const notifyText = t('modqueue.notify_flagged', user.username, prepareNotificationText(comment.body));
        return this.handleCommentChange(prev, comment, notifyText);
      },
    });

    this.subscriptions.push(sub1, sub2, sub3, sub4);
  }

  unsubscribe() {
    this.subscriptions.forEach((unsubscribe) => unsubscribe());
    this.subscriptions = [];
  }

  resubscribe(variables) {
    this.unsubscribe();
    this.subscribeToUpdates(variables);
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
      this.resubscribe(nextProps.data.variables);
    }
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
      sortOrder: this.props.data.variables.sortOrder,
      asset_id: this.props.data.variables.asset_id,
      statuses: this.props.queueConfig[tab].statuses,
      action_type: this.props.queueConfig[tab].action_type,
    };
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
    const {root, root: {asset, settings}, data} = this.props;
    const assetId = getAssetId(this.props);

    if (data.error) {
      return <div>Error</div>;
    }

    if (assetId) {
      if (asset === null) {

        // Not found.
        return <NotFoundAsset assetId={assetId} />;
      }
      if (asset === undefined || asset.id !== assetId) {

        // Still loading.
        return <Spinner />;
      }
    } else if (asset !== undefined || !('premodCount' in root)) {

      // loading.
      return <Spinner />;
    }

    const premodEnabled = assetId ? isPremod(asset.settings.moderation) : 
      isPremod(settings.moderation);

    const currentQueueConfig = Object.assign({}, this.props.queueConfig);

    if (premodEnabled && root.newCount === 0) {
      delete currentQueueConfig.new;
    } else if (root.premodCount === 0) {
      delete currentQueueConfig.premod;
    }

    return <Moderation
      {...this.props}
      getModPath={getModPath}
      loadMore={this.loadMore}
      acceptComment={this.acceptComment}
      rejectComment={this.rejectComment}
      activeTab={this.activeTab}
      queueConfig={currentQueueConfig}
      handleCommentChange={this.handleCommentChange}
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
  query CoralAdmin_Moderation_LoadMore($limit: Int = 10, $cursor: Cursor, $sortOrder: SORT_ORDER, $asset_id: ID, $statuses:[COMMENT_STATUS!], $action_type: ACTION_TYPE) {
    comments(query: {limit: $limit, cursor: $cursor, asset_id: $asset_id, statuses: $statuses, sortOrder: $sortOrder, action_type: $action_type}) {
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

const withModQueueQuery = withQuery(({queueConfig}) => gql`
  query CoralAdmin_Moderation($asset_id: ID, $sortOrder: SORT_ORDER, $allAssets: Boolean!) {
    ${Object.keys(queueConfig).map((queue) => `
      ${queue}: comments(query: {
        ${queueConfig[queue].statuses ? `statuses: [${queueConfig[queue].statuses.join(', ')}],` : ''}
        ${queueConfig[queue].tags ? `tags: ["${queueConfig[queue].tags.join('", "')}"],` : ''}
        ${queueConfig[queue].action_type ? `action_type: ${queueConfig[queue].action_type}` : ''}
        asset_id: $asset_id,
        sortOrder: $sortOrder
      }) {
        ...CoralAdmin_Moderation_CommentConnection
      }
    `)}
    ${Object.keys(queueConfig).map((queue) => `
      ${queue}Count: commentCount(query: {
        ${queueConfig[queue].statuses ? `statuses: [${queueConfig[queue].statuses.join(', ')}],` : ''}
        ${queueConfig[queue].tags ? `tags: ["${queueConfig[queue].tags.join('", "')}"],` : ''}
        ${queueConfig[queue].action_type ? `action_type: ${queueConfig[queue].action_type}` : ''}
        asset_id: $asset_id,
      })
    `)}
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
  }
  ${commentConnectionFragment}
`, {
  options: (props) => {
    const id = getAssetId(props);
    return {
      variables: {
        asset_id: id,
        sortOrder: props.moderation.sortOrder,
        allAssets: id === null,
      },
      fetchPolicy: 'network-only'
    };
  },
});

const withQueueCountPolling = withQuery(({queueConfig}) => gql`
  query CoralAdmin_ModerationCountPoll($asset_id: ID) {
    ${Object.keys(queueConfig).map((queue) => `
      ${queue}Count: commentCount(query: {
        ${queueConfig[queue].statuses ? `statuses: [${queueConfig[queue].statuses.join(', ')}],` : ''}
        ${queueConfig[queue].tags ? `tags: ["${queueConfig[queue].tags.join('", "')}"],` : ''}
        ${queueConfig[queue].action_type ? `action_type: ${queueConfig[queue].action_type}` : ''}
        asset_id: $asset_id,
      })
    `)}
  }
`, {
  options: (props) => {
    const id = getAssetId(props);
    return {
      pollInterval: 5000,
      variables: {
        asset_id: id
      }
    };
  }
});

const mapStateToProps = (state) => ({
  moderation: state.moderation,
  settings: state.settings,
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    toggleModal,
    singleView,
    fetchSettings,
    showBanUserDialog,
    hideShortcutsNote,
    toggleStorySearch,
    showSuspendUserDialog,
    viewUserDetail,
    setSortOrder,
    storySearchChange,
    clearState,
    notify,
  }, dispatch),
});

export default compose(
  withQueueConfig(baseQueueConfig),
  connect(mapStateToProps, mapDispatchToProps),
  withSetCommentStatus,
  withQueueCountPolling,
  withModQueueQuery,
)(ModerationContainer);
