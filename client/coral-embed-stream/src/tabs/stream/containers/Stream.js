import React from 'react';
import PropTypes from 'prop-types';
import { gql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  ADDTL_COMMENTS_ON_LOAD_MORE,
  ASSET_COMMENTS_LOAD_DEPTH,
  ADDTL_REPLIES_ON_LOAD_MORE,
  THREADING_LEVEL,
} from '../../../constants/stream';
import {
  withPostComment,
  withPostFlag,
  withPostDontAgree,
  withDeleteAction,
  withEditComment,
} from 'coral-framework/graphql/mutations';

import { showSignInDialog } from 'coral-embed-stream/src/actions/login';
import { notify } from 'coral-framework/actions/notification';
import {
  setActiveReplyBox,
  setActiveTab,
  viewAllComments,
} from '../../../actions/stream';
import Stream from '../components/Stream';
import { default as Comment, singleCommentFragment } from './Comment';
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
import StreamError from '../components/StreamError';

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
        {
          subscriptionData: {
            data: { commentEdited },
          },
        }
      ) => {
        // Ignore mutations from me.
        // TODO: need way to detect mutations created by this client, and allow mutations from other clients.
        if (
          this.props.currentUser &&
          commentEdited.user.id === this.props.currentUser.id
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
      updateQuery: (
        prev,
        {
          subscriptionData: {
            data: { commentAdded },
          },
        }
      ) => {
        // Ignore mutations from me.
        // TODO: need way to detect mutations created by this client, and allow mutations from other clients.
        if (
          this.props.currentUser &&
          commentAdded.user.id === this.props.currentUser.id
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
        limit: parent_id
          ? ADDTL_REPLIES_ON_LOAD_MORE
          : ADDTL_COMMENTS_ON_LOAD_MORE,
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

  userIsDegraged({ currentUser } = this.props) {
    return !can(currentUser, 'INTERACT_WITH_COMMUNITY');
  }

  render() {
    if (this.props.data.error) {
      return <StreamError>{this.props.data.error.message}</StreamError>;
    }

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
        asset={this.props.asset}
        activeStreamTab={this.props.activeStreamTab}
        data={this.props.data}
        root={this.props.root}
        activeReplyBox={this.props.activeReplyBox}
        setActiveReplyBox={this.props.setActiveReplyBox}
        commentClassNames={this.props.commentClassNames}
        setActiveStreamTab={this.props.setActiveStreamTab}
        postFlag={this.props.postFlag}
        postDontAgree={this.props.postDontAgree}
        deleteAction={this.props.deleteAction}
        showSignInDialog={this.props.showSignInDialog}
        currentUser={this.props.currentUser}
        emit={this.props.emit}
        sortOrder={this.props.sortOrder}
        sortBy={this.props.sortBy}
        appendItemArray={this.props.appendItemArray}
        updateItem={this.props.updateItem}
        viewAllComments={this.props.viewAllComments}
        notify={this.props.notify}
        postComment={this.props.postComment}
        editComment={this.props.editComment}
        loadMoreComments={this.loadMoreComments}
        loadNewReplies={this.loadNewReplies}
        userIsDegraged={this.userIsDegraged()}
        loading={streamLoading}
      />
    );
  }
}

StreamContainer.propTypes = {
  asset: PropTypes.object,
  activeStreamTab: PropTypes.string,
  data: PropTypes.object,
  root: PropTypes.object,
  activeReplyBox: PropTypes.string,
  setActiveReplyBox: PropTypes.func,
  commentClassNames: PropTypes.array,
  setActiveStreamTab: PropTypes.func,
  postFlag: PropTypes.func,
  postDontAgree: PropTypes.func.isRequired,
  deleteAction: PropTypes.func,
  showSignInDialog: PropTypes.func,
  currentUser: PropTypes.object,
  emit: PropTypes.func,
  sortOrder: PropTypes.string,
  sortBy: PropTypes.string,
  loading: PropTypes.bool,
  appendItemArray: PropTypes.func,
  updateItem: PropTypes.func,
  viewAllComments: PropTypes.func,
  notify: PropTypes.func.isRequired,
  postComment: PropTypes.func.isRequired,
  editComment: PropTypes.func,
  previousTab: PropTypes.string,
};

const streamCommentFragment = gql`
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

const streamSingleCommentFragment = gql`
  fragment CoralEmbedStream_Stream_singleComment on Comment {
    id
    status
    user {
      id
    }
    ...${getDefinitionName(singleCommentFragment)}
  }
  ${singleCommentFragment}
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
  ${streamCommentFragment}
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
  ${streamCommentFragment}
`;

const slots = [
  'commentInputDetailArea',
  'streamTabs',
  'streamTabsPrepend',
  'streamTabPanes',
  'streamFilter',
  'stream',
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
            alwaysPremod {
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
            ...CoralEmbedStream_Stream_singleComment
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
        disableCommenting
        disableCommentingMessage
        charCountEnable
        charCount
        requireEmailConfirmation
      }
      totalCommentCount @skip(if: $hasComment)
      comments(query: {limit: ${ASSET_COMMENTS_LOAD_DEPTH}, excludeIgnored: $excludeIgnored, sortOrder: $sortOrder, sortBy: $sortBy}) @skip(if: $hasComment) {
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
    ${streamCommentFragment}
    ${streamSingleCommentFragment}
  `,
};

const mapStateToProps = state => ({
  currentUser: state.auth.user,
  activeReplyBox: state.stream.activeReplyBox,
  commentId: state.stream.commentId,
  assetId: state.stream.assetId,
  assetUrl: state.stream.assetUrl,
  activeTab: state.embed.activeTab,
  previousTab: state.embed.previousTab,
  activeStreamTab: state.stream.activeTab,
  previousStreamTab: state.stream.previousTab,
  commentClassNames: state.stream.commentClassNames,
  sortOrder: state.stream.sortOrder,
  sortBy: state.stream.sortBy,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      showSignInDialog,
      notify,
      setActiveReplyBox,
      viewAllComments,
      setActiveStreamTab: setActiveTab,
    },
    dispatch
  );

export default compose(
  withFragments(fragments),
  withEmit,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withPostComment,
  // `talk-plugin-flags` has a custom error handling logic.
  withPostFlag({ notifyOnError: false }),
  withPostDontAgree,
  withDeleteAction,
  withEditComment
)(StreamContainer);
