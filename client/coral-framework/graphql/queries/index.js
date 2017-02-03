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
}

const getAssetUrl = () => {
  const assetUrl = getQueryVariable('asset_url');

  // if there is an asset_url var, use this
  if (assetUrl !== '' && typeof assetUrl !== 'undefined') {
    return assetUrl;
  }

  // if not asset url defined, use the pym parent url
  return getQueryVariable('parentUrl');
};

export const queryStream = graphql(STREAM_QUERY, {
  options: () => ({
    variables: {
      asset_url: getAssetUrl()
    }
  })
});

export const myCommentHistory = graphql(MY_COMMENT_HISTORY, {});
