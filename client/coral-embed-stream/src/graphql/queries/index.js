import {graphql} from 'react-apollo';
import STREAM_QUERY from './streamQuery.graphql';
import pym from '../../PymConnection';

let url = pym.parentUrl.split('#')[0] || 'http://localhost:3000/';

export const queryStream = graphql(STREAM_QUERY, {
  options: {variables: {asset_url: url}}
});
