import {graphql} from 'react-apollo';
import STREAM_QUERY from './streamQuery.graphql';

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

export const queryStream = graphql(STREAM_QUERY, {
  options: {variables: {asset_url: getQueryVariable('asset_url')}}
});
