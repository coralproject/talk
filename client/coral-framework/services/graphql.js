import reduceDocument, {createTypeGetter} from '../graphql/reduceDocument';
import {addTypenameToDocument} from 'apollo-client/queries/queryTransform';

/**
 * createGraphQLService
 * @param  {string}  basename  base path of the url
 * @return {Object}  histor service
 */
export function createGraphQLService(registry, {
  introspectionData,
  optimize = false,
}) {
  const reduceOptions = {
    typeGetter: optimize && introspectionData ? createTypeGetter(introspectionData) : null,

    // Use shared fragment map.
    // Attention: Fragment names must be unique otherwise weird things will happen.
    fragmentMap: {},
  };

  return {
    registry,
    resolveDocument(documentOrCallback, props, context) {
      let document = typeof documentOrCallback === 'function'
        ? documentOrCallback(props, context)
        : documentOrCallback;
      document = registry.resolveFragments(document);

      if (optimize) {
        document = reduceDocument(document, reduceOptions);
      }

      // We also add typenames to the document which apollo would usually do,
      // but we also use the network interface in subscriptions directly
      // which require the resolved typenames.
      return addTypenameToDocument(document);
    },
  };
}
