import graphql from '@coralproject/graphql-anywhere-optimized';
import { createTypeGetter } from 'graphql-ast-tools';
import introspectionData from './introspection.json';

// Use typeGetter to get more optimized documents.
const typeGetter = createTypeGetter(introspectionData);

// Use global fragment cache for transformed fragments.
const fragmentMap = {};

export default (...args) => {
  while (args.length < 7) {
    args.push(undefined);
  }

  const transformOptions = {
    typeGetter,
    fragmentMap,
  };

  args[6] = transformOptions;
  return graphql(...args);
};
