import React from 'react';
import {gql, compose} from 'react-apollo';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {NEW_COMMENT_COUNT_POLL_INTERVAL, ADDTL_COMMENTS_ON_LOAD_MORE} from '../constants/stream';
import {
  withPostComment, withPostFlag, withPostDontAgree, withDeleteAction,
  withAddCommentTag, withRemoveCommentTag, withIgnoreUser, withEditComment,
} from 'coral-framework/graphql/mutations';
import update from 'immutability-helper';

import {notificationActions, authActions} from 'coral-framework';
import {editName} from 'coral-framework/actions/user';
import {setCommentCountCache, setActiveReplyBox} from '../actions/stream';
import Stream from '../components/Stream';
import Comment from './Comment';
import {withFragments} from 'coral-framework/hocs';
import {getDefinitionName} from 'coral-framework/utils';

const {showSignInDialog} = authActions;
const {addNotification} = notificationActions;

class StreamContainer extends React.Component {
  getCounts = (variables) => {
    return this.props.data.fetchMore({
      query: LOAD_COMMENT_COUNTS_QUERY,
      variables,

      // Apollo requires this, even though we don't use it...
      updateQuery: (data) => data,
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

  loadNewComments = () => {
    return this.props.data.fetchMore({
      query: LOAD_MORE_QUERY,
      variables: {
        limit: ADDTL_COMMENTS_ON_LOAD_MORE,
        cursor: this.props.root.asset.comments.startCursor,
        parent_id: null,
        asset_id: this.props.root.asset.id,
        sort: 'CHRONOLOGICAL',
        excludeIgnored: this.props.data.variables.excludeIgnored,
      },
      updateQuery: (prev, {fetchMoreResult:{comments}}) => {
        if (!comments.nodes.length) {
          return prev;
        }
        return update(prev, {
          asset: {
            comments: {
              startCursor: {$set: comments.endCursor},
              nodes: {$apply: (nodes) => comments.nodes.filter(
                  (comment) => !nodes.some((node) => node.id === comment.id)
                )
                .concat(nodes)
                .sort(descending)
              },
            },
          },
        });
      },
    });
  };

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
    if (this.props.previousTab) {
      this.props.data.refetch()
        .then(({data: {asset: {commentCount}}}) => {
          return this.props.setCommentCountCache(commentCount);
        });
    }
    this.countPoll = setInterval(() => {
      this.getCounts(this.props.data.variables);
    }, NEW_COMMENT_COUNT_POLL_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this.countPoll);
  }

  render() {
    return <Stream
      {...this.props}
      loadMore={this.loadMore}
      loadMoreComments={this.loadMoreComments}
      loadNewComments={this.loadNewComments}
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

const descending = (a, b) => ascending(a, b) * -1;

const LOAD_COMMENT_COUNTS_QUERY = gql`
  query CoralEmbedStream_LoadCommentCounts($assetUrl: String, , $commentId: ID!, $assetId: ID, $hasComment: Boolean!, $excludeIgnored: Boolean) {
    comment(id: $commentId) @include(if: $hasComment) {
      id
      parent {
        id
        replyCount(excludeIgnored: $excludeIgnored)
      }
      replyCount(excludeIgnored: $excludeIgnored)
    }
    asset(id: $assetId, url: $assetUrl) {
      id
      commentCount(excludeIgnored: $excludeIgnored)
      comments(limit: 10) @skip(if: $hasComment) {
        nodes {
          id
          replyCount(excludeIgnored: $excludeIgnored)
        }
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
  commentClassNames: state.comment.commentClassNames
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    showSignInDialog,
    addNotification,
    setActiveReplyBox,
    editName,
    setCommentCountCache,
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

