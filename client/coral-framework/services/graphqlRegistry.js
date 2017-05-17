import {getDefinitionName, mergeDocuments} from 'coral-framework/utils';
import {getGraphQLExtensions} from 'coral-framework/helpers/plugins';
import globalFragments from 'coral-framework/graphql/fragments';
import uniq from 'lodash/uniq';

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
 * Get a document with a fragment named `key`, which contains
 * all fragments added under this key.
 */
export function getFragmentDocument(key) {
  init();

  if (!(key in fragments)) {
    return '';
  }

  let documents = fragments[key] ? fragments[key].documents : [];
  let fields =  fragments[key] ? `...${fragments[key].names.join('\n...')}\n` : ' __typename';

  // Assemble arguments for `gql` to call it directly without using template literals.
  const main = `
    fragment ${key} on ${fragments[key].type} {
      ${fields}
    }
  `;
  return mergeDocuments([main, ...documents]);
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

export function resolveFragments(document) {
  if (document.loc.source) {

    // resolve fragments from registry
    const matchedSubFragments = document.loc.source.body.match(/\.\.\.(.*)/g) || [];
    const subFragments =
      uniq(matchedSubFragments.map((f) => f.replace('...', '')))
      .map((key) => getFragmentDocument(key))
      .filter((i) => i);

    if (subFragments.length > 0) {
      return mergeDocuments([document, ...subFragments]);
    }
  } else {
    console.warn('Can only resolve fragments from documents definied using the gql tag.');
  }
  return document;
}
