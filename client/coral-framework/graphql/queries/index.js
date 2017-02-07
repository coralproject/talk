import {graphql} from 'react-apollo';
import STREAM_QUERY from './streamQuery.graphql';
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
  return 'http://dev.default.stream';
}

export const queryStream = graphql(STREAM_QUERY, {
  options: () => ({
    variables: {
      asset_url: getQueryVariable('asset_url')
    }
  })
});

export const myCommentHistory = graphql(MY_COMMENT_HISTORY, {});
