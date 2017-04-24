import React from 'react';
import {compose, gql, graphql} from 'react-apollo';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import isEqual from 'lodash/isEqual';
import uniqBy from 'lodash/uniqBy';
import sortBy from 'lodash/sortBy';
import isNil from 'lodash/isNil';

import {Spinner} from 'coral-ui';
import {postComment, postFlag, postLike, postDontAgree, deleteAction, addCommentTag, removeCommentTag, ignoreUser} from 'coral-framework/graphql/mutations';
import {editName} from 'coral-framework/actions/user';
import {notificationActions, authActions, assetActions, pym} from 'coral-framework';
import {NEW_COMMENT_COUNT_POLL_INTERVAL} from '../constants/stream';
import Embed from '../components/Embed';
import {setCommentCountCache, setActiveReplyBox, viewAllComments} from '../actions/stream';
import {setActiveTab} from '../actions/embed';
import * as Stream from './Stream';

const {logout, showSignInDialog, requestConfirmEmail, checkLogin} = authActions;
const {addNotification, clearNotification} = notificationActions;
const {fetchAssetSuccess} = assetActions;

class EmbedContainer extends React.Component {

  componentDidMount() {
    pym.sendMessage('childReady');
    this.props.checkLogin();
  }

  componentWillUnmount() {
    clearInterval(this.countPoll);
  }

  componentWillReceiveProps(nextProps) {
    const {fetchAssetSuccess} = this.props;
    if(!isEqual(nextProps.data.asset, this.props.data.asset)) {

      // TODO: remove asset data from redux store.
      fetchAssetSuccess(nextProps.data.asset);

      const {getCounts, setCommentCountCache, commentCountCache} = this.props;
      const {asset} = nextProps.data;

      if (commentCountCache === -1) {
        setCommentCountCache(asset.commentCount);
      }

      this.countPoll = setInterval(() => {
        const {asset} = this.props.data;
        getCounts({
          asset_id: asset.id,
          limit: asset.comments.length,
          sort: 'REVERSE_CHRONOLOGICAL'
        });
      }, NEW_COMMENT_COUNT_POLL_INTERVAL);
    }
  }

  componentDidUpdate(prevProps) {
    if(!isEqual(prevProps.data.comment, this.props.data.comment)) {

      // Scroll to a permalinked comment if one is in the URL once the page is done rendering.
      setTimeout(() => pym.scrollParentToChildEl('coralStream'), 0);
    }
  }

  render() {
    if (!this.props.data.asset) {
      return <Spinner />;
    }
    return <Embed {...this.props} />;
  }
}

const fragments = {
  commentView: gql`
    fragment commentView on Comment {
      id
      body
      created_at
      status
      tags {
        name
      }
      user {
          id
          name: username
      }
      action_summaries {
        ...actionSummaryView
      }
    }
  `,
  actionSummaryView: gql`
    fragment actionSummaryView on ActionSummary {
      __typename
      count
      current_user {
        id
        created_at
      }
    }
  `,
};

const LOAD_COMMENT_COUNTS_QUERY = gql`
  query LoadCommentCounts($asset_id: ID, $limit: Int = 5, $sort: SORT_ORDER) {
    asset(id: $asset_id) {
      id
      commentCount
      comments(sort: $sort, limit: $limit) {
        id
        replyCount
      }
    }
  }
`;

const LOAD_MORE_QUERY = gql`
  query LoadMoreComments($limit: Int = 5, $cursor: Date, $parent_id: ID, $asset_id: ID, $sort: SORT_ORDER, $excludeIgnored: Boolean) {
    new_top_level_comments: comments(query: {limit: $limit, cursor: $cursor, parent_id: $parent_id, asset_id: $asset_id, sort: $sort, excludeIgnored: $excludeIgnored}) {
      ...commentView
      replyCount(excludeIgnored: $excludeIgnored)
      replies(limit: 3) {
          ...commentView
      }
    }
  }
  ${fragments.commentView}
  ${fragments.actionSummaryView}
`;

const STREAM_QUERY = gql`
  query StreamQuery($assetId: ID, $assetUrl: String, $commentId: ID!, $hasComment: Boolean!, $excludeIgnored: Boolean) {
    __typename
    ...Stream_root
  }
  ${Stream.fragments.root}
`;

// get the counts of the top-level comments
const getCounts = (data) => ({asset_id, limit, sort}) => {
  return data.fetchMore({
    query: LOAD_COMMENT_COUNTS_QUERY,
    variables: {
      asset_id,
      limit,
      sort,
      excludeIgnored: data.variables.excludeIgnored,
    },
    updateQuery: (oldData, {fetchMoreResult:{asset}}) => {
      return {
        ...oldData,
        asset: {
          ...oldData.asset,
          commentCount: asset.commentCount
        }
      };
    }
  });
};

// handle paginated requests for more Comments pertaining to the Asset
const loadMore = (data) => ({limit, cursor, parent_id = null, asset_id, sort}, newComments) => {
  return data.fetchMore({
    query: LOAD_MORE_QUERY,
    variables: {
      limit, // how many comments are we returning
      cursor, // the date of the first/last comment depending on the sort order
      parent_id, // if null, we're loading more top-level comments, if not, we're loading more replies to a comment
      asset_id, // the id of the asset we're currently on
      sort, // CHRONOLOGICAL or REVERSE_CHRONOLOGICAL
      excludeIgnored: data.variables.excludeIgnored,
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

export const withQuery = graphql(STREAM_QUERY, {
  options: ({auth, commentId, assetId, assetUrl}) => ({
    variables: {
      assetId,
      assetUrl,
      commentId,
      hasComment: commentId !== '',
      excludeIgnored: Boolean(auth && auth.user && auth.user.id),
    },
  }),
  props: ({data}) => ({
    data,
    loadMore: loadMore(data),
    getCounts: getCounts(data),
  })
});

const mapStateToProps = state => ({
  auth: state.auth.toJS(),
  commentCountCache: state.stream.commentCountCache,
  activeReplyBox: state.stream.activeReplyBox,
  commentId: state.stream.commentId,
  assetId: state.stream.assetId,
  assetUrl: state.stream.assetUrl,
  activeTab: state.embed.activeTab,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    showSignInDialog,
    requestConfirmEmail,
    fetchAssetSuccess,
    addNotification,
    clearNotification,
    checkLogin,
    editName,
    setCommentCountCache,
    viewAllComments,
    logout,
    setActiveReplyBox,
    setActiveTab,
  }, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  postComment,
  postFlag,
  postLike,
  postDontAgree,
  addCommentTag,
  removeCommentTag,
  ignoreUser,
  deleteAction,
  withQuery,
)(EmbedContainer);

