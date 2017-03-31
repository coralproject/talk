import {graphql} from 'react-apollo';
import STREAM_QUERY from './streamQuery.graphql';
import LOAD_MORE from './loadMore.graphql';
import GET_COUNTS from './getCounts.graphql';
import MY_COMMENT_HISTORY from './myCommentHistory.graphql';
import uniqBy from 'lodash/uniqBy';
import sortBy from 'lodash/sortBy';
import isNil from 'lodash/isNil';

function getQueryVariable(variable) {
  let query = window.location.search.substring(1);
  let vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) === variable) {
      return decodeURIComponent(pair[1]);
    }
  }

  // If not found, return null.
  return null;
}

// get the counts of the top-level comments
export const getCounts = (data) => ({asset_id, limit, sort}) => {
  return data.fetchMore({
    query: GET_COUNTS,
    variables: {
      asset_id,
      limit,
      sort
    },
    updateQuery: (oldData, {fetchMoreResult:{data}}) => {

      return {
        ...oldData,
        asset: {
          ...oldData.asset,
          commentCount: data.asset.commentCount
        }
      };
    }
  });
};

// handle paginated requests for more Comments pertaining to the Asset
export const loadMore = (data) => ({limit, cursor, parent_id = null, asset_id, sort}, newComments) => {
  return data.fetchMore({
    query: LOAD_MORE,
    variables: {
      limit, // how many comments are we returning
      cursor, // the date of the first/last comment depending on the sort order
      parent_id, // if null, we're loading more top-level comments, if not, we're loading more replies to a comment
      asset_id, // the id of the asset we're currently on
      sort // CHRONOLOGICAL or REVERSE_CHRONOLOGICAL
    },
    updateQuery: (oldData, {fetchMoreResult:{data:{new_top_level_comments}}}) => {

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

// load the comment stream.
export const queryStream = graphql(STREAM_QUERY, {
  options: () => {

    // where the query string is from the embeded iframe url
    let comment_id = getQueryVariable('comment_id');
    let has_comment = comment_id != null;

    return {
      variables: {
        asset_id: getQueryVariable('asset_id'),
        asset_url: getQueryVariable('asset_url'),
        comment_id: has_comment ? comment_id : 'no-comment',
        has_comment
      }
    };
  },
  props: ({data}) => ({
    data,
    loadMore: loadMore(data),
    getCounts: getCounts(data),
  })
});

export const myCommentHistory = graphql(MY_COMMENT_HISTORY, {});
