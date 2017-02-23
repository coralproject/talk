import {graphql} from 'react-apollo';
import STREAM_QUERY from './streamQuery.graphql';
import LOAD_MORE from './loadMore.graphql';
import GET_COUNTS from './getCounts.graphql';
import MY_COMMENT_HISTORY from './myCommentHistory.graphql';

function getQueryVariable(variable) {
  let query = window.location.search.substring(1);
  let vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) === variable) {
      return decodeURIComponent(pair[1]);
    }
  }

  // If no query is included, return a default string for development
  return 'http://localhost/default/stream';
}

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

export const loadMore = (data) => ({limit, cursor, parent_id, asset_id, sort}, newComments) => {
  return data.fetchMore({
    query: LOAD_MORE,
    variables: {
      limit,
      cursor,
      parent_id,
      asset_id,
      sort
    },
    updateQuery: (oldData, {fetchMoreResult:{data:{new_top_level_comments}}}) => {

      let updatedAsset;

      if (parent_id) {

        // If loading more replies
        updatedAsset = {
          ...oldData,
          asset: {
            ...oldData.asset,
            comments: oldData.asset.comments.map((comment) =>
              comment.id === parent_id
              ? {...comment, replies: [...comment.replies, ...new_top_level_comments]}
              : comment)
          }
        };
      } else {

        // If loading more top-level comments
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

export const queryStream = graphql(STREAM_QUERY, {
  options: () => ({
    variables: {
      asset_url: getQueryVariable('asset_url')
    }
  }),
  props: ({data}) => ({
    data,
    loadMore: loadMore(data),
    getCounts: getCounts(data),
  })
});

export const myCommentHistory = graphql(MY_COMMENT_HISTORY, {});
