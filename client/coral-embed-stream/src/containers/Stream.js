import React from 'react';
import {gql, compose} from 'react-apollo';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import uniqBy from 'lodash/uniqBy';
import sortBy from 'lodash/sortBy';
import isNil from 'lodash/isNil';
import {NEW_COMMENT_COUNT_POLL_INTERVAL} from '../constants/stream';
import {
  withPostComment, withPostFlag, withPostDontAgree, withDeleteAction,
  withAddCommentTag, withRemoveCommentTag, ignoreUser,
} from 'coral-framework/graphql/mutations';
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
      updateQuery: data => data,
    });
  };

  // handle paginated requests for more Comments pertaining to the Asset
  loadMore = ({limit, cursor, parent_id = null, asset_id, sort}, newComments) => {
    return this.props.data.fetchMore({
      query: LOAD_MORE_QUERY,
      variables: {
        limit, // how many comments are we returning
        cursor, // the date of the first/last comment depending on the sort order
        parent_id, // if null, we're loading more top-level comments, if not, we're loading more replies to a comment
        asset_id, // the id of the asset we're currently on
        sort, // CHRONOLOGICAL or REVERSE_CHRONOLOGICAL
        excludeIgnored: this.props.data.variables.excludeIgnored,
      },
      updateQuery: (oldData, {fetchMoreResult:{new_top_level_comments}}) => {
        let updatedAsset;

        if (!isNil(oldData.comment)) { // loaded replies on a highlighted (permalinked) comment

          let comment = {};
          if (oldData.comment && oldData.comment.parent) {

            // put comments (replies) onto the oldData.comment.parent object
            // the initial comment permalinked was a reply
            const uniqReplies = uniqBy([...new_top_level_comments, ...oldData.comment.parent.replies], 'id');
            comment.parent = {...oldData.comment.parent, replies: sortBy(uniqReplies, 'created_at')};
          } else if (oldData.comment) {

            // put the comments (replies) directly onto oldData.comment
            // the initial comment permalinked was a top-level comment
            const uniqReplies = uniqBy([...new_top_level_comments, ...oldData.comment.replies], 'id');
            comment.replies = sortBy(uniqReplies, 'created_at');
          }

          updatedAsset = {
            ...oldData,
            comment: {
              ...oldData.comment,
              ...comment
            }
          };

        } else if (parent_id) { // If loading more replies

          updatedAsset = {
            ...oldData,
            asset: {
              ...oldData.asset,
              comments: oldData.asset.comments.map(comment => {

                // since the dipslayed replies and the returned replies can overlap,
                // pull out the unique ones.
                const uniqueReplies = uniqBy([...new_top_level_comments, ...comment.replies], 'id');

                // since we just gave the returned replies precedence, they're now out of order.
                // resort according to date.
                return comment.id === parent_id
                  ? {...comment, replies: sortBy(uniqueReplies, 'created_at')}
                  : comment;
              })
            }
          };
        } else { // If loading more top-level comments

          updatedAsset = {
            ...oldData,
            asset: {
              ...oldData.asset,
              comments: newComments ? [...new_top_level_comments.reverse(), ...oldData.asset.comments]
                : [...oldData.asset.comments, ...new_top_level_comments]
            }
          };
        }

        return updatedAsset;
      }
    });
  };

  componentDidMount() {
    if (this.props.previousTab) {
      this.props.data.refetch();
    }
    this.countPoll = setInterval(() => {
      this.getCounts(this.props.data.variables);
    }, NEW_COMMENT_COUNT_POLL_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this.countPoll);
  }

  render() {
    return <Stream {...this.props} loadMore={this.loadMore}/>;
  }
}

const LOAD_COMMENT_COUNTS_QUERY = gql`
  query LoadCommentCounts($assetUrl: String, $assetId: ID, $excludeIgnored: Boolean) {
    asset(id: $assetId, url: $assetUrl) {
      id
      commentCount(excludeIgnored: $excludeIgnored)
      comments(limit: 10) {
        id
        replyCount(excludeIgnored: $excludeIgnored)
      }
    }
  }
`;

const LOAD_MORE_QUERY = gql`
  query LoadMoreComments($limit: Int = 5, $cursor: Date, $parent_id: ID, $asset_id: ID, $sort: SORT_ORDER, $excludeIgnored: Boolean) {
    new_top_level_comments: comments(query: {limit: $limit, cursor: $cursor, parent_id: $parent_id, asset_id: $asset_id, sort: $sort, excludeIgnored: $excludeIgnored}) {
      ...${getDefinitionName(Comment.fragments.comment)}
      replyCount(excludeIgnored: $excludeIgnored)
      replies(limit: 3) {
        ...${getDefinitionName(Comment.fragments.comment)}
      }
    }
  }
  ${Comment.fragments.comment}
`;

const fragments = {
  root: gql`
    fragment Stream_root on RootQuery {
      comment(id: $commentId) @include(if: $hasComment) {
        ...${getDefinitionName(Comment.fragments.comment)}
        replyCount(excludeIgnored: $excludeIgnored)
        replies {
          ...${getDefinitionName(Comment.fragments.comment)}
        }
        parent {
          ...${getDefinitionName(Comment.fragments.comment)}
          replyCount(excludeIgnored: $excludeIgnored)
          replies {
            ...${getDefinitionName(Comment.fragments.comment)}
          }
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
        lastComment {
          id
        }
        commentCount(excludeIgnored: $excludeIgnored)
        totalCommentCount(excludeIgnored: $excludeIgnored)
        comments(limit: 10, excludeIgnored: $excludeIgnored) {
          ...${getDefinitionName(Comment.fragments.comment)}
          replyCount(excludeIgnored: $excludeIgnored)
          replies(limit: 3, excludeIgnored: $excludeIgnored) {
            ...${getDefinitionName(Comment.fragments.comment)}
          }
        }
      }
      myIgnoredUsers {
        id,
        username,
      }
      me {
        status
      }
      ...${getDefinitionName(Comment.fragments.root)}
    }
    ${Comment.fragments.root}
    ${Comment.fragments.comment}
  `,
};

const mapStateToProps = state => ({
  auth: state.auth.toJS(),
  commentCountCache: state.stream.commentCountCache,
  activeReplyBox: state.stream.activeReplyBox,
  commentId: state.stream.commentId,
  assetId: state.stream.assetId,
  assetUrl: state.stream.assetUrl,
  activeTab: state.embed.activeTab,
  previousTab: state.embed.previousTab,
});

const mapDispatchToProps = dispatch =>
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
  ignoreUser,
  withDeleteAction,
)(StreamContainer);

