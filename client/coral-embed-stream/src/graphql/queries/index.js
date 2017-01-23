import {graphql} from 'react-apollo';
import STREAM_QUERY from './streamQuery.graphql';
import Pym from 'pym.js';

const pym = new Pym.Child({polling: 100});
let url = pym.parentUrl || 'http://localhost:3000/';

export const queryStream = graphql(STREAM_QUERY, {
  options: {variables: {asset_url: url}}
});
