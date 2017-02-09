import React from 'react';
import ReactDOM from 'react-dom';
import {GraphQLDocs} from 'graphql-docs';

import fetcher from './services/fetcher';

// Render the application into the DOM
ReactDOM.render(<div className='wrapper'>
  <h1>Talk: GraphQL Docs</h1>
  <GraphQLDocs fetcher={fetcher} />
</div>, document.querySelector('#root'));
