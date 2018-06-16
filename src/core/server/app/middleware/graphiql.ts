import playground from 'graphql-playground-middleware-express';

export default () => playground({ endpoint: '/api/graphql' });
