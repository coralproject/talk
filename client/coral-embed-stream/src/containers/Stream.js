import React from 'react';
import {gql, compose} from 'react-apollo';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ADDTL_COMMENTS_ON_LOAD_MORE} from '../constants/stream';
import {
  withPostComment, withPostFlag, withPostDontAgree, withDeleteAction,
  withAddCommentTag, withRemoveCommentTag, withIgnoreUser, withEditComment,
} from 'coral-framework/graphql/mutations';
import update from 'immutability-helper';

import {notificationActions, authActions} from 'coral-framework';
import {editName} from 'coral-framework/actions/user';
import {setActiveReplyBox} from '../actions/stream';
import Stream from '../components/Stream';
import Comment from './Comment';
import {withFragments} from 'coral-framework/hocs';
import {getDefinitionName} from 'coral-framework/utils';
import {findCommentInEmbedQuery, insertCommentIntoEmbedQuery, removeCommentFromEmbedQuery} from '../graphql/utils';

const {showSignInDialog} = authActions;
const {addNotification} = notificationActions;

class StreamContainer extends React.Component {
  subscribeToUpdates = () => {
    this.props.data.subscribeToMore({
      document: COMMENTS_EDITED_SUBSCRIPTION,
      variables: {
        assetId: this.props.root.asset.id,
      },
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
    });
    this.props.data.subscribeToMore({
      document: COMMENTS_ADDED_SUBSCRIPTION,
      variables: {
        assetId: this.props.root.asset.id,
      },
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
    });
  };

  loadNewReplies = (parent_id) => {
    const comment = this.props.root.comment
      ? this.props.root.comment.parent || this.props.root.comment // highlighted comment.
      : this.props.root.asset.comments.nodes.filter((comment) => comment.id === parent_id)[0];

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
        if (!comments.nodes.length) {
          return prev;
        }

        const updateNode = (node) =>
          update(node, {
            replies: {
              endCursor: {$set: comments.endCursor},
              nodes: {$apply: (nodes) => nodes
                .concat(comments.nodes.filter(
                  (comment) => !nodes.some((node) => node.id === comment.id)
                ))
                .sort(ascending)
              },
            },
          });

        // highlighted comment.
        if (prev.comment) {
          if (prev.comment.parent) {
            return update(prev, {
              comment: {
                parent: {$apply: (comment) => updateNode(comment)},
              }
            });
          }
          return update(prev, {
            comment: {$apply: (comment) => updateNode(comment)},
          });
        }

        return update(prev, {
          asset: {
            comments: {
              nodes: {
                $apply: (nodes) => nodes.map(
                  (node) => node.id !== parent_id
                    ? node
                    : updateNode(node)
                  )
              },
            },
          },
        });
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
        if (!comments.nodes.length) {
          return prev;
        }

        return update(prev, {
          asset: {
            comments: {
              hasNextPage: {$set: comments.hasNextPage},
              endCursor: {$set: comments.endCursor},
              nodes: {$push: comments.nodes},
            },
          },
        });
      },
    });
  };

  componentDidMount() {
    this.subscribeToUpdates();
  }

  componentWillUnmount() {
    clearInterval(this.countPoll);
  }

  render() {
    return <Stream
      {...this.props}
      loadMore={this.loadMore}
      loadMoreComments={this.loadMoreComments}
      loadNewReplies={this.loadNewReplies}
    />;
  }
}

const ascending = (a, b) => {
  const dateA = new Date(a.created_at);
  const dateB = new Date(b.created_at);
  if (dateA < dateB) { return -1; }
  if (dateA > dateB) { return 1; }
  return 0;
};

const commentFragment = gql`
  fragment CoralEmbedStream_Stream_comment on Comment {
    id
    ...${getDefinitionName(Comment.fragments.comment)}
    replyCount(excludeIgnored: $excludeIgnored)
    replies {
      nodes {
        id
        ...${getDefinitionName(Comment.fragments.comment)}
      }
      hasNextPage
      startCursor
      endCursor
    }
  }
  ${Comment.fragments.comment}
`;

const COMMENTS_ADDED_SUBSCRIPTION = gql`
  subscription onCommentAdded($assetId: ID!, $excludeIgnored: Boolean){
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
  subscription onCommentEdited($assetId: ID!){
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
        replyCount(excludeIgnored: $excludeIgnored)
        replies(limit: 3, excludeIgnored: $excludeIgnored) {
          nodes {
            id
            ...${getDefinitionName(Comment.fragments.comment)}
          }
          hasNextPage
          startCursor
          endCursor
        }
      }
      hasNextPage
      startCursor
      endCursor
    }
  }
  ${Comment.fragments.comment}
`;

const fragments = {
  root: gql`
    fragment CoralEmbedStream_Stream_root on RootQuery {
      comment(id: $commentId) @include(if: $hasComment) {
        ...CoralEmbedStream_Stream_comment
        parent {
          ...CoralEmbedStream_Stream_comment
        }
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
      ...${getDefinitionName(Comment.fragments.root)}
    }
    ${Comment.fragments.root}
    ${commentFragment}
  `,
};

const mapStateToProps = (state) => ({
  auth: state.auth.toJS(),
  commentCountCache: state.stream.commentCountCache,
  activeReplyBox: state.stream.activeReplyBox,
  commentId: state.stream.commentId,
  assetId: state.stream.assetId,
  assetUrl: state.stream.assetUrl,
  activeTab: state.embed.activeTab,
  previousTab: state.embed.previousTab,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    showSignInDialog,
    addNotification,
    setActiveReplyBox,
    editName,
  }, dispatch);

export default compose(
  withFragments(fragments),
  connect(mapStateToProps, mapDispatchToProps),
  withPostComment,
  withPostFlag,
  withPostDontAgree,
  withAddCommentTag,
  withRemoveCommentTag,
  withIgnoreUser,
  withDeleteAction,
  withEditComment,
)(StreamContainer);

