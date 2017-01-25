import {graphql} from 'react-apollo';
import STREAM_QUERY from './streamQuery.graphql';
import MY_COMMENT_HISTORY from './myCommentHistory.graphql';

import pym from 'coral-framework/PymConnection';
let url = pym.parentUrl.split('#')[0] || 'http://localhost:3000/';

export const queryStream = graphql(STREAM_QUERY, {
  options: () => ({
    variables: {
      asset_url: url
    }
  })
});

export const myCommentHistory = graphql(MY_COMMENT_HISTORY, {});
