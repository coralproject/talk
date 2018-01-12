import React from 'react';
import { gql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  ADDTL_COMMENTS_ON_LOAD_MORE,
  THREADING_LEVEL,
} from '../../../constants/stream';
import {
  withPostComment,
  withPostFlag,
  withPostDontAgree,
  withDeleteAction,
  withEditComment,
} from 'coral-framework/graphql/mutations';

import * as authActions from 'coral-embed-stream/src/actions/auth';
import * as notificationActions from 'coral-framework/actions/notification';
import {
  setActiveReplyBox,
  setActiveTab,
  viewAllComments,
} from '../../../actions/stream';
import Stream from '../components/Stream';
import Comment from './Comment';
import { withFragments, withEmit } from 'coral-framework/hocs';
import {
  getDefinitionName,
  getSlotFragmentSpreads,
} from 'coral-framework/utils';
import { Spinner } from 'coral-ui';
import { can } from 'coral-framework/services/perms';
import {
  findCommentInEmbedQuery,
  findCommentInAsset,
  insertCommentIntoEmbedQuery,
  removeCommentFromEmbedQuery,
  insertFetchedCommentsIntoEmbedQuery,
  nest,
} from '../../../graphql/utils';

const { showSignInDialog, editName } = authActions;
const { notify } = notificationActions;

class StreamContainer extends React.Component {
  commentsAddedSubscription = null;
  commentsEditedSubscription = null;

  subscribeToCommentsEdited() {
    this.commentsEditedSubscription = this.props.data.subscribeToMore({
      document: COMMENTS_EDITED_SUBSCRIPTION,
      variables: {
        assetId: this.props.asset.id,
      },
      updateQuery: (
        prev,
        { subscriptionData: { data: { commentEdited } } }
      ) => {
        // Ignore mutations from me.
        // TODO: need way to detect mutations created by this client, and allow mutations from other clients.
        if (
          this.props.auth.user &&
          commentEdited.user.id === this.props.auth.user.id
        ) {
          return prev;
        }

        // Exit when comment is not in the query.
        if (!findCommentInEmbedQuery(prev, commentEdited.id)) {
          return prev;
        }

        if (
          ['PREMOD', 'REJECTED', 'SYSTEM_WITHHELD'].includes(
            commentEdited.status
          )
        ) {
          return removeCommentFromEmbedQuery(prev, commentEdited.id);
        }
      },
    });
  }

  subscribeToCommentsAdded() {
    this.commentsAddedSubscription = this.props.data.subscribeToMore({
      document: COMMENTS_ADDED_SUBSCRIPTION,
      variables: {
        assetId: this.props.asset.id,
      },
      updateQuery: (prev, { subscriptionData: { data: { commentAdded } } }) => {
        // Ignore mutations from me.
        // TODO: need way to detect mutations created by this client, and allow mutations from other clients.
        if (
          this.props.auth.user &&
          commentAdded.user.id === this.props.auth.user.id
        ) {
          return prev;
        }

        // Exit if author is ignored.
        if (
          this.props.root.me &&
          this.props.root.me.ignoredUsers.some(
            ({ id }) => id === commentAdded.user.id
          )
        ) {
          return prev;
        }

        // Exit when comment is already in the query.
        if (findCommentInEmbedQuery(prev, commentAdded.id)) {
          return prev;
        }

        // Newest top-level comments are only added when sorting by 'newest first'.
        if (!commentAdded.parent && !this.isSortedByNewestFirst()) {
          return prev;
        }
        return insertCommentIntoEmbedQuery(prev, commentAdded);
      },
    });
  }

  unsubscribeCommentsAdded() {
    if (this.commentsAddedSubscription) {
      this.commentsAddedSubscription();
      this.commentsAddedSubscription = null;
    }
  }

  unsubscribeCommentsEdited() {
    if (this.commentsEditedSubscription) {
      this.commentsEditedSubscription();
      this.commentsEditedSubscription = null;
    }
  }

  loadNewReplies = parent_id => {
    const comment = findCommentInAsset(this.props.asset, parent_id);

    return this.props.data.fetchMore({
      query: LOAD_MORE_QUERY,
      variables: {
        limit: parent_id ? 999999 : ADDTL_COMMENTS_ON_LOAD_MORE,
        cursor: comment.replies.endCursor,
        parent_id,
        asset_id: this.props.asset.id,
        sortOrder: 'ASC',
        excludeIgnored: this.props.data.variables.excludeIgnored,
      },
      updateQuery: (prev, { fetchMoreResult: { comments } }) => {
        return insertFetchedCommentsIntoEmbedQuery(prev, comments, parent_id);
      },
    });
  };

  loadMoreComments = () => {
    return this.props.data.fetchMore({
      query: LOAD_MORE_QUERY,
      variables: {
        limit: ADDTL_COMMENTS_ON_LOAD_MORE,
        cursor: this.props.asset.comments.endCursor,
        parent_id: null,
        asset_id: this.props.asset.id,
        sortOrder: this.props.data.variables.sortOrder,
        sortBy: this.props.data.variables.sortBy,
        excludeIgnored: this.props.data.variables.excludeIgnored,
      },
      updateQuery: (prev, { fetchMoreResult: { comments } }) => {
        return insertFetchedCommentsIntoEmbedQuery(prev, comments);
      },
    });
  };

  isSortedByNewestFirst({ sortBy, sortOrder } = this.props) {
    return sortBy === 'CREATED_AT' && sortOrder === 'DESC';
  }

  componentDidMount() {
    if (this.props.previousTab) {
      this.props.data.refetch();
    }

    if (this.isSortedByNewestFirst()) {
      this.subscribeToCommentsAdded();
    }

    this.subscribeToCommentsEdited();
  }

  componentWillUnmount() {
    this.unsubscribeCommentsAdded();
    this.unsubscribeCommentsEdited();
    clearInterval(this.countPoll);
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.sortOrder !== nextProps.sortOrder ||
      this.props.sortBy !== nextProps.sortBy
    ) {
      nextProps.data.refetch();
    }
  }

  userIsDegraged({ auth: { user } } = this.props) {
    return !can(user, 'INTERACT_WITH_COMMUNITY');
  }

  render() {
    if (
      !this.props.asset ||
      (this.props.asset.comment === undefined && !this.props.asset.comments)
    ) {
      return <Spinner />;
    }

    // @TODO: Detect refetch when we have apollo 2.0.
    const streamLoading = this.props.data.loading;

    return (
      <Stream
        {...this.props}
        loadMore={this.loadMore}
        loadMoreComments={this.loadMoreComments}
        loadNewReplies={this.loadNewReplies}
        userIsDegraged={this.userIsDegraged()}
        loading={streamLoading}
      />
    );
  }
}

const commentFragment = gql`
  fragment CoralEmbedStream_Stream_comment on Comment {
    id
    status
    user {
      id
    }
    ...${getDefinitionName(Comment.fragments.comment)}
  }
  ${Comment.fragments.comment}
`;

const COMMENTS_ADDED_SUBSCRIPTION = gql`
  subscription CommentAdded($assetId: ID!, $excludeIgnored: Boolean) {
    commentAdded(asset_id: $assetId) {
      parent {
        id
      }
      ...CoralEmbedStream_Stream_comment
    }
  }
  ${commentFragment}
`;

const COMMENTS_EDITED_SUBSCRIPTION = gql`
  subscription CommentEdited($assetId: ID!) {
    commentEdited(asset_id: $assetId) {
      id
      body
      status
      editing {
        edited
      }
      user {
        id
      }
    }
  }
`;

const LOAD_MORE_QUERY = gql`
  query CoralEmbedStream_LoadMoreComments(
    $limit: Int = 5
    $cursor: Cursor
    $parent_id: ID
    $asset_id: ID
    $sortOrder: SORT_ORDER
    $sortBy: SORT_COMMENTS_BY = CREATED_AT
    $excludeIgnored: Boolean
  ) {
    comments(
      query: {
        limit: $limit
        cursor: $cursor
        parent_id: $parent_id
        asset_id: $asset_id
        sortOrder: $sortOrder
        sortBy: $sortBy
        excludeIgnored: $excludeIgnored
      }
    ) {
      nodes {
        ...CoralEmbedStream_Stream_comment
      }
      hasNextPage
      startCursor
      endCursor
    }
  }
  ${commentFragment}
`;

const slots = [
  'streamTabs',
  'streamTabsPrepend',
  'streamTabPanes',
  'streamFilter',
];

const fragments = {
  root: gql`
    fragment CoralEmbedStream_Stream_root on RootQuery {
      me {
        state {
          status {
            username {
              status
            }
            banned {
              status
            }
            suspension {
              until
            }
          }
        }
        ignoredUsers {
          id
        }
        role
      }
      settings {
        organizationName
      }
      ${getSlotFragmentSpreads(slots, 'root')}
      ...${getDefinitionName(Comment.fragments.root)}
    }
    ${Comment.fragments.root}
  `,
  asset: gql`
    fragment CoralEmbedStream_Stream_asset on Asset {
      comment(id: $commentId) @include(if: $hasComment) {
        ...CoralEmbedStream_Stream_comment
        ${nest(
          `
          parent {
            ...CoralEmbedStream_Stream_comment
            ...nest
          }
        `,
          THREADING_LEVEL
        )}
      }
      id
      title
      url
      isClosed
      created_at
      settings {
        moderation
        infoBoxEnable
        infoBoxContent
        premodLinksEnable
        questionBoxEnable
        questionBoxContent
        questionBoxIcon
        closedTimeout
        closedMessage
        charCountEnable
        charCount
        requireEmailConfirmation
      }
      totalCommentCount @skip(if: $hasComment)
      comments(query: {limit: 10, excludeIgnored: $excludeIgnored, sortOrder: $sortOrder, sortBy: $sortBy}) @skip(if: $hasComment) {
        nodes {
          ...CoralEmbedStream_Stream_comment
        }
        hasNextPage
        startCursor
        endCursor
      }
      ${getSlotFragmentSpreads(slots, 'asset')}
      ...${getDefinitionName(Comment.fragments.asset)}
    }
    ${Comment.fragments.asset}
    ${commentFragment}
  `,
};

const mapStateToProps = state => ({
  auth: state.auth,
  activeReplyBox: state.stream.activeReplyBox,
  commentId: state.stream.commentId,
  assetId: state.stream.assetId,
  assetUrl: state.stream.assetUrl,
  activeTab: state.embed.activeTab,
  previousTab: state.embed.previousTab,
  activeStreamTab: state.stream.activeTab,
  previousStreamTab: state.stream.previousTab,
  commentClassNames: state.stream.commentClassNames,
  pluginConfig: state.config.plugin_config,
  sortOrder: state.stream.sortOrder,
  sortBy: state.stream.sortBy,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      showSignInDialog,
      notify,
      setActiveReplyBox,
      editName,
      viewAllComments,
      setActiveStreamTab: setActiveTab,
    },
    dispatch
  );

export default compose(
  withFragments(fragments),
  withEmit,
  connect(mapStateToProps, mapDispatchToProps),
  withPostComment,
  withPostFlag,
  withPostDontAgree,
  withDeleteAction,
  withEditComment
)(StreamContainer);
