import {getDefinitionName, mergeDocuments} from 'coral-framework/utils';
import {getGraphQLExtensions, getSlotFragments} from 'coral-framework/helpers/plugins';
import globalFragments from 'coral-framework/graphql/fragments';
import uniq from 'lodash/uniq';
import {gql} from 'react-apollo';

/*
 * Disable false-positive warning below, as it doesn't work well with how we currently
 * assemble the queries.
 *
 * Warning: fragment with name {fragment name} already exists.
 * graphql-tag enforces all fragment names across your application to be unique; read more about
 * this in the docs: http://dev.apollodata.com/core/fragments.html#unique-names
 */
gql.disableFragmentWarnings();

const fragments = {};
const mutationOptions = {};
const queryOptions = {};

const getTypeName = (ast) => ast.definitions[0].typeCondition.name.value;

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
export function addFragment(key, document) {
  const type = getTypeName(document);
  const name = getDefinitionName(document);
  if (!(key in fragments)) {
    fragments[key] = {type, names: [name], documents: [document]};
  } else {
    if (type !== fragments[key].type) {
      console.error(`Type mismatch ${type} !== ${fragments[key].type}`);
    }
    fragments[key].names.push(name);
    fragments[key].documents.push(document);
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
export function addMutationOptions(key, config) {
  if (!(key in mutationOptions)) {
    mutationOptions[key] = [config];
  } else {
    mutationOptions[key].push(config);
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
export function addQueryOptions(key, config) {
  if (!(key in queryOptions)) {
    queryOptions[key] = [config];
  } else {
    queryOptions[key].push(config);
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
export function add(extension) {
  Object.keys(extension.fragments || []).forEach((key) => addFragment(key, extension.fragments[key]));
  Object.keys(extension.mutations || []).forEach((key) => addMutationOptions(key, extension.mutations[key]));
  Object.keys(extension.queries || []).forEach((key) => addQueryOptions(key, extension.queries[key]));
}

/**
 * Get a list of mutation options.
 */
export function getMutationOptions(key) {
  init();
  return mutationOptions[key] || [];
}

/**
 * Get a list of query options.
 */
export function getQueryOptions(key) {
  init();
  return queryOptions[key] || [];
}

/**
 * getSlotFragmentDocument handles `key`s in the form of TalkSlot_SlotName_Resource.
 * It parses the slot name and the resource and usees the plugin API to assemble
 * the fragment document.
 */
function getSlotFragmentDocument(key) {
  const match = key.match(/TalkSlot_(.*)_(.*)/);
  if (!match) {
    return '';
  }

  const slot = match[1][0].toLowerCase() + match[1].substr(1);
  const resource = match[2];
  const documents = getSlotFragments(slot, resource);

  if (documents.length === 0) {
    return '';
  }

  const names = documents.map((d) => getDefinitionName(d));
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
function getRegistryFragmentDocument(key) {
  if (!(key in fragments)) {
    return '';
  }

  let documents = fragments[key].documents;
  let fields =  `...${fragments[key].names.join('\n...')}\n`;

  // Assemble arguments for `gql` to call it directly without using template literals.
  const main = `
    fragment ${key} on ${fragments[key].type} {
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
export function getFragmentDocument(key) {
  init();
  return getRegistryFragmentDocument(key) || getSlotFragmentDocument(key);
}

// The fragments and configs are lazily loaded to allow circular dependencies to work.
// TODO: We might want to change this to an explicit add after we have lazy Queries and Mutations.
let initialized = false;

function init() {
  if (initialized) { return; }
  initialized = true;

  // Add fragments from framework.
  [globalFragments].forEach((map) =>
    Object.keys(map).forEach((key) => addFragment(key, map[key]))
  );

  // Add configs from plugins.
  getGraphQLExtensions().forEach((ext) => add(ext));
}

/**
 * resolveFragments finds fragment spread names and attachs
 * the related fragment document to the given root document.
 */
export function resolveFragments(document) {
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

      const matchedSubFragments = body.match(/\.\.\.([_a-zA-Z][_a-zA-Z0-9]*)/g) || [];
      uniq(matchedSubFragments.map((f) => f.replace('...', '')))
        .filter((key) => resolvedKeys.indexOf(key) === -1)
        .forEach((key) => {
          const doc = getFragmentDocument(key);
          if (doc) {
            subFragments.push(doc);

            // We found a new fragment, so we are not done yet.
            done = false;
          } else if(key.startsWith('TalkSlot_')) {
            spreadsToBeRemoved.push(key);
          }
          resolvedKeys.push(key);
        });

      body = mergeDocuments([body, ...subFragments]).loc.source.body;
    }

    spreadsToBeRemoved.forEach((key) => {
      const regex = new RegExp(`\\.\\.\\.${key}\n`, 'g');
      body = body.replace(regex, '');
    });

    return gql`${body}`;
  } else {
    console.warn('Can only resolve fragments from documents definied using the gql tag.');
  }
  return document;
}
