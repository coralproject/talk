import { getDefinitionName, mergeDocuments } from 'coral-framework/utils';
import uniq from 'lodash/uniq';
import { gql } from 'react-apollo';

/*
 * Disable false-positive warning below, as it doesn't work well with how we currently
 * assemble the queries.
 *
 * Warning: fragment with name {fragment name} already exists.
 * graphql-tag enforces all fragment names across your application to be unique; read more about
 * this in the docs: http://dev.apollodata.com/core/fragments.html#unique-names
 */
gql.disableFragmentWarnings();

const getTypeName = ast => ast.definitions[0].typeCondition.name.value;

class GraphQLRegistry {
  fragments = {};
  mutationOptions = {};
  queryOptions = {};

  constructor(getSlotFragments) {
    this.getSlotFragments = getSlotFragments;
  }

  /**
   * Add fragment
   *
   * Example:
   * addFragment('MyFragment', gql`
   *   fragment Plugin_MyFragment on Comment {
   *     body
   *   }
   * `);
   */
  addFragment(key, document) {
    const type = getTypeName(document);
    const name = getDefinitionName(document);
    if (!(key in this.fragments)) {
      this.fragments[key] = { type, names: [name], documents: [document] };
    } else {
      if (type !== this.fragments[key].type) {
        console.error(`Type mismatch ${type} !== ${this.fragments[key].type}`);
      }
      this.fragments[key].names.push(name);
      this.fragments[key].documents.push(document);
    }
  }

  /**
   * Add mutation options.
   *
   * Example:
   * // state is the current redux state, which is sometimes
   * // necessary to fill the optimistic response.
   * addMutationOptions('PostComment', ({variables, state}) => ({
   *   optimisticResponse: {
   *     CreateComment: {
   *       extra: '',
   *     },
   *   },
   *   refetchQueries: [],
   *   updateQueries: {
   *     EmbedQuery: (previous, data) => {
   *       return previous;
   *     },
   *   },
   *   update: (proxy, result) => {
   *   },
   * })
   */
  addMutationOptions(key, config) {
    if (!(key in this.mutationOptions)) {
      this.mutationOptions[key] = [config];
    } else {
      this.mutationOptions[key].push(config);
    }
  }

  /**
   * Add query options.
   *
   * Example:
   * addQueryOptions('EmbedQuery', {
   *   reducer: (previousResult, action, variables) => previousResult,
   * });
   */
  addQueryOptions(key, config) {
    if (!(key in this.queryOptions)) {
      this.queryOptions[key] = [config];
    } else {
      this.queryOptions[key].push(config);
    }
  }

  /**
   * Add all fragments, mutation options, and query options defined in the object.
   *
   * Example:
   * add({
   *   fragments: {
   *     CreateCommentResponse: gql`
   *       fragment CoralRandomEmoji_CreateCommentResponse on CreateCommentResponse {
   *         [...]
   *       }`,
   *   },
   *   mutations: {
   *     // state is the current redux state, which is sometimes
   *     // necessary to fill the optimistic response.
   *     PostComment: ({variables, state}) => ({
   *       optimisticResponse: {
   *         [...]
   *       },
   *       refetchQueries: [],
   *       updateQueries: {
   *         EmbedQuery: (previous, data) => {
   *           return previous;
   *         },
   *       },
   *       update: (proxy, result) => {
   *       },
   *     })
   *   },
   *   queries: {
   *     EmbedQuery: {
   *       reducer: (previousResult, action, variables)  => {
   *         return previousResult;
   *       },
   *     },
   *   },
   * });
   */
  add(extension) {
    Object.keys(extension.fragments || []).forEach(key =>
      this.addFragment(key, extension.fragments[key])
    );
    Object.keys(extension.mutations || []).forEach(key =>
      this.addMutationOptions(key, extension.mutations[key])
    );
    Object.keys(extension.queries || []).forEach(key =>
      this.addQueryOptions(key, extension.queries[key])
    );
  }

  /**
   * Get a list of mutation options.
   */
  getMutationOptions(key) {
    return this.mutationOptions[key] || [];
  }

  /**
   * Get a list of query options.
   */
  getQueryOptions(key) {
    return this.queryOptions[key] || [];
  }

  /**
   * getSlotFragmentDocument handles `key`s in the form of TalkSlot_SlotName_Resource.
   * It parses the slot name and the resource and usees the plugin API to assemble
   * the fragment document.
   */
  getSlotFragmentDocument(key) {
    const match = key.match(/TalkSlot_(.*)_(.*)/);
    if (!match) {
      return '';
    }

    const slot = match[1][0].toLowerCase() + match[1].substr(1);
    const resource = match[2];
    const documents = this.getSlotFragments(slot, resource);

    if (documents.length === 0) {
      return '';
    }

    const names = documents.map(d => getDefinitionName(d));
    const typeName = getTypeName(documents[0]);

    // Assemble arguments for `gql` to call it directly without using template literals.
    const main = `
      fragment ${key} on ${typeName} {
        ...${names.join('\n...')}\n
      }
    `;
    return mergeDocuments([main, ...documents]);
  }

  /**
   * getRegistryFragmentDocument assembles a fragment document using
   * all registered fragment under given `key`.
   */
  getRegistryFragmentDocument(key) {
    if (!(key in this.fragments)) {
      return '';
    }

    let documents = this.fragments[key].documents;
    let fields = `...${this.fragments[key].names.join('\n...')}\n`;

    // Assemble arguments for `gql` to call it directly without using template literals.
    const main = `
      fragment ${key} on ${this.fragments[key].type} {
        ${fields}
      }
    `;
    return mergeDocuments([main, ...documents]);
  }

  /**
   * getFragmentDocument returns a fragment that assembles all registered
   * fragments under given `key` or if `key` refers to Slot fragments it will
   * return the slot fragments specified by this key.
   */
  getFragmentDocument(key) {
    return (
      this.getRegistryFragmentDocument(key) || this.getSlotFragmentDocument(key)
    );
  }

  /**
   * resolveFragments finds fragment spread names and attachs
   * the related fragment document to the given root document.
   */
  resolveFragments(document) {
    if (document.loc.source) {
      // Remember keys that we have already resolved.
      const resolvedKeys = [];

      // Spreads from slots that are empty and need to be removed.
      // (works around the issue that we don't know the resource type
      // if we don't have a fragment)
      const spreadsToBeRemoved = [];

      // fragments to be attached.
      const subFragments = [];

      // body contains the final result.
      let body = document.loc.source.body;

      let done = false;
      while (!done) {
        done = true;

        const matchedSubFragments =
          body.match(/\.\.\.([_a-zA-Z][_a-zA-Z0-9]*)/g) || [];
        uniq(matchedSubFragments.map(f => f.replace('...', '')))
          .filter(key => resolvedKeys.indexOf(key) === -1)
          .forEach(key => {
            const doc = this.getFragmentDocument(key);
            if (doc) {
              subFragments.push(doc);

              // We found a new fragment, so we are not done yet.
              done = false;
            } else if (key.startsWith('TalkSlot_')) {
              spreadsToBeRemoved.push(key);
            }
            resolvedKeys.push(key);
          });

        body = mergeDocuments([body, ...subFragments]).loc.source.body;
      }

      spreadsToBeRemoved.forEach(key => {
        const regex = new RegExp(`\\.\\.\\.${key}\n`, 'g');
        body = body.replace(regex, '');
      });

      return gql`
        ${body}
      `;
    } else {
      console.warn(
        'Can only resolve fragments from documents definied using the gql tag.'
      );
    }
    return document;
  }
}

/**
 * createGraphQLRegistry
 * @param  {Function}  getSlotFragments  A callback with signature `(slot, part) => [documents]` to retrieve slot fragments.
 * @return {Object}    graphql registry
 */
export function createGraphQLRegistry(getSlotFragments) {
  return new GraphQLRegistry(getSlotFragments);
}
