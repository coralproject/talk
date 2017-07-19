import React from 'react';
import {gql, compose} from 'react-apollo';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ADDTL_COMMENTS_ON_LOAD_MORE, THREADING_LEVEL} from '../constants/stream';
import {
  withPostComment, withPostFlag, withPostDontAgree,
  withDeleteAction, withIgnoreUser, withEditComment
} from 'coral-framework/graphql/mutations';

import * as authActions from 'coral-framework/actions/auth';
import * as notificationActions from 'coral-framework/actions/notification';
import {editName} from 'coral-framework/actions/user';
import {setActiveReplyBox, setActiveTab, viewAllComments} from '../actions/stream';
import Stream from '../components/Stream';
import Comment from './Comment';
import {withFragments} from 'coral-framework/hocs';
import {getDefinitionName, getSlotFragmentSpreads} from 'coral-framework/utils';
import {Spinner} from 'coral-ui';
import {
  findCommentInEmbedQuery,
  insertCommentIntoEmbedQuery,
  removeCommentFromEmbedQuery,
  insertFetchedCommentsIntoEmbedQuery,
  nest,
} from '../graphql/utils';

const {showSignInDialog} = authActions;
const {addNotification} = notificationActions;

class StreamContainer extends React.Component {
  subscriptions = [];

  subscribeToUpdates() {
    const newSubscriptions = [{
      document: COMMENTS_EDITED_SUBSCRIPTION,
      updateQuery: (prev, {subscriptionData: {data: {commentEdited}}}) => {

        // Ignore mutations from me.
        // TODO: need way to detect mutations created by this client, and allow mutations from other clients.
        if (this.props.auth.user && commentEdited.user.id === this.props.auth.user.id) {
          return prev;
        }

        // Exit when comment is not in the query.
        if (!findCommentInEmbedQuery(prev, commentEdited.id)) {
          return prev;
        }

        if (['PREMOD', 'REJECTED'].includes(commentEdited.status)) {
          return removeCommentFromEmbedQuery(prev, commentEdited.id);
        }
      },
    },
    {
      document: COMMENTS_ADDED_SUBSCRIPTION,
      updateQuery: (prev, {subscriptionData: {data: {commentAdded}}}) => {

        // Ignore mutations from me.
        // TODO: need way to detect mutations created by this client, and allow mutations from other clients.
        if (this.props.auth.user && commentAdded.user.id === this.props.auth.user.id) {
          return prev;
        }

        // Exit if author is ignored.
        if (
          this.props.root.me &&
          this.props.root.me.ignoredUsers.some(({id}) => id === commentAdded.user.id)) {
          return prev;
        }

        // Exit when comment is already in the query.
        if (findCommentInEmbedQuery(prev, commentAdded.id)) {
          return prev;
        }

        return insertCommentIntoEmbedQuery(prev, commentAdded);
      }
    }];

    this.subscriptions = newSubscriptions.map((s) => this.props.data.subscribeToMore({
      document: s.document,
      variables: {
        assetId: this.props.root.asset.id,
      },
      updateQuery: s.updateQuery,
    }));
  }

  unsubscribe() {
    this.subscriptions.forEach((unsubscribe) => unsubscribe());
    this.subscriptions = [];
  }

  loadNewReplies = (parent_id) => {
    const comment = findCommentInEmbedQuery(this.props.root, parent_id);

    return this.props.data.fetchMore({
      query: LOAD_MORE_QUERY,
      variables: {
        limit: parent_id ? 999999 : ADDTL_COMMENTS_ON_LOAD_MORE,
        cursor: comment.replies.endCursor,
        parent_id,
        asset_id: this.props.root.asset.id,
        sort: 'CHRONOLOGICAL',
        excludeIgnored: this.props.data.variables.excludeIgnored,
      },
      updateQuery: (prev, {fetchMoreResult:{comments}}) => {
        return insertFetchedCommentsIntoEmbedQuery(prev, comments, parent_id);
      },
    });
  }

  loadMoreComments = () => {
    return this.props.data.fetchMore({
      query: LOAD_MORE_QUERY,
      variables: {
        limit: ADDTL_COMMENTS_ON_LOAD_MORE,
        cursor: this.props.root.asset.comments.endCursor,
        parent_id: null,
        asset_id: this.props.root.asset.id,
        sort: 'REVERSE_CHRONOLOGICAL',
        excludeIgnored: this.props.data.variables.excludeIgnored,
      },
      updateQuery: (prev, {fetchMoreResult:{comments}}) => {
        return insertFetchedCommentsIntoEmbedQuery(prev, comments);
      },
    });
  };

  componentDidMount() {
    if (this.props.previousTab) {
      this.props.data.refetch();
    }
    this.subscribeToUpdates();
  }

  componentWillUnmount() {
    this.unsubscribe();
    clearInterval(this.countPoll);
  }

  render() {
    if (this.props.refetching) {
      return <Spinner />;
    }
    return <Stream
      {...this.props}
      loadMore={this.loadMore}
      loadMoreComments={this.loadMoreComments}
      loadNewReplies={this.loadNewReplies}
    />;
  }
}

const commentFragment = gql`
  fragment CoralEmbedStream_Stream_comment on Comment {
    id
    ...${getDefinitionName(Comment.fragments.comment)}
    ${nest(`
      replies(excludeIgnored: $excludeIgnored) {
        nodes {
          id
          ...${getDefinitionName(Comment.fragments.comment)}
          ...nest
        }
        hasNextPage
        startCursor
        endCursor
      }
    `, THREADING_LEVEL)}
  }
  ${Comment.fragments.comment}
`;

const COMMENTS_ADDED_SUBSCRIPTION = gql`
  subscription CommentAdded($assetId: ID!, $excludeIgnored: Boolean){
    commentAdded(asset_id: $assetId){
      parent {
        id
      }
      ...CoralEmbedStream_Stream_comment
    }
  }
  ${commentFragment}
`;

const COMMENTS_EDITED_SUBSCRIPTION = gql`
  subscription CommentEdited($assetId: ID!){
    commentEdited(asset_id: $assetId){
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
  query CoralEmbedStream_LoadMoreComments($limit: Int = 5, $cursor: Date, $parent_id: ID, $asset_id: ID, $sort: SORT_ORDER, $excludeIgnored: Boolean) {
    comments(query: {limit: $limit, cursor: $cursor, parent_id: $parent_id, asset_id: $asset_id, sort: $sort, excludeIgnored: $excludeIgnored}) {
      nodes {
        id
        ...${getDefinitionName(Comment.fragments.comment)}
        ${nest(`
          replies(limit: 3, excludeIgnored: $excludeIgnored) {
            nodes {
              id
              ...${getDefinitionName(Comment.fragments.comment)}
              ...nest
            }
            hasNextPage
            startCursor
            endCursor
          }
        `, THREADING_LEVEL)}
      }
      hasNextPage
      startCursor
      endCursor
    }
  }
  ${Comment.fragments.comment}
`;

const slots = [
  'streamTabs',
  'streamTabPanes',
];

const fragments = {
  root: gql`
    fragment CoralEmbedStream_Stream_root on RootQuery {
      comment(id: $commentId) @include(if: $hasComment) {
        ...CoralEmbedStream_Stream_comment
        ${nest(`
          parent {
            ...CoralEmbedStream_Stream_comment
            ...nest
          }
        `, THREADING_LEVEL)}
      }
      asset(id: $assetId, url: $assetUrl) {
        id
        title
        url
        closedAt
        created_at
        settings {
          moderation
          infoBoxEnable
          infoBoxContent
          premodLinksEnable
          questionBoxEnable
          questionBoxContent
          closeTimeout
          closedMessage
          charCountEnable
          charCount
          requireEmailConfirmation
        }
        commentCount(excludeIgnored: $excludeIgnored)
        totalCommentCount(excludeIgnored: $excludeIgnored)
        comments(limit: 10, excludeIgnored: $excludeIgnored) @skip(if: $hasComment) {
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
      me {
        status
        ignoredUsers {
          id
        }
      }
      settings {
        organizationName
      }
      ${getSlotFragmentSpreads(slots, 'root')}
      ...${getDefinitionName(Comment.fragments.root)}
    }
    ${Comment.fragments.asset}
    ${Comment.fragments.root}
    ${commentFragment}
  `,
};

const mapStateToProps = (state) => ({
  auth: state.auth.toJS(),
  refetching: state.embed.refetching,
  commentCountCache: state.stream.commentCountCache,
  activeReplyBox: state.stream.activeReplyBox,
  commentId: state.stream.commentId,
  assetId: state.stream.assetId,
  assetUrl: state.stream.assetUrl,
  activeTab: state.embed.activeTab,
  previousTab: state.embed.previousTab,
  activeStreamTab: state.stream.activeTab,
  previousStreamTab: state.stream.previousTab,
  commentClassNames: state.stream.commentClassNames
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    showSignInDialog,
    addNotification,
    setActiveReplyBox,
    editName,
    viewAllComments,
    setActiveStreamTab: setActiveTab,
  }, dispatch);

export default compose(
  withFragments(fragments),
  connect(mapStateToProps, mapDispatchToProps),
  withPostComment,
  withPostFlag,
  withPostDontAgree,
  withIgnoreUser,
  withDeleteAction,
  withEditComment,
)(StreamContainer);
