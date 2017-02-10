import React from 'react';
import ReactDOM from 'react-dom';
import {GraphQLDocs} from 'graphql-docs';

import fetcher from './services/fetcher';

// Render the application into the DOM
ReactDOM.render(<GraphQLDocs fetcher={fetcher} />, document.querySelector('#root'));
