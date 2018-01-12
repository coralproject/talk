import React from 'react';
import { render } from 'react-dom';
import { GraphQLDocs } from 'graphql-docs';

import fetcher from './services/fetcher';

// Render the application into the DOM
render(<GraphQLDocs fetcher={fetcher} />, document.querySelector('#root'));
