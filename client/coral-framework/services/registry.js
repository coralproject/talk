import {gql} from 'react-apollo';
import {getDefinitionName} from 'coral-framework/utils';
import {getGraphQLConfigs} from 'coral-framework/helpers/plugins';
import globalFragments from 'coral-framework/graphql/fragments';

const fragments = {};
const mutationOptions = {};
const queryOptions = {};

const getTypeName = (ast) => ast.definitions[0].typeCondition.name.value;

/**
 * Register fragment
 *
 * Example:
 * registerFragment('MyFragment', gql`
 *   fragment Plugin_MyFragment on Comment {
 *     body
 *   }
 * `);
 */
export function registerFragment(key, document) {
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
 * Register mutation options.
 *
 * Example:
 * registerMutationOptions('PostComment', ({variables, state}) => ({
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
export function registerMutationOptions(key, config) {
  if (!(key in mutationOptions)) {
    mutationOptions[key] = [config];
  } else {
    mutationOptions[key].push(config);
  }
}

/**
 * Register query options.
 *
 * Example:
 * registerQueryOptions('EmbedQuery', {
 *   reducer: (previousResult, action, variables) => previousResult,
 * });
 */
export function registerQueryOptions(key, config) {
  if (!(key in queryOptions)) {
    queryOptions[key] = [config];
  } else {
    queryOptions[key].push(config);
  }
}

/**
 * Register all fragments, mutation options, and query options defined in the object.
 *
 * Example:
 * registerConfig({
 *   fragments: {
 *     CreateCommentResponse: gql`
 *       fragment CoralRandomEmoji_CreateCommentResponse on CreateCommentResponse {
 *         [...]
 *       }`,
 *   },
 *   mutations: {
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
export function registerConfig(cfg) {
  Object.keys(cfg.fragments || []).forEach(key => registerFragment(key, cfg.fragments[key]));
  Object.keys(cfg.mutations || []).forEach(key => registerMutationOptions(key, cfg.mutations[key]));
  Object.keys(cfg.queries || []).forEach(key => registerQueryOptions(key, cfg.queries[key]));
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
 * all fragments registered under this key.
 */
export function getFragmentDocument(key) {
  init();
  let documents = fragments[key] ? fragments[key].documents : [];
  let fields =  fragments[key] ? `...${fragments[key].names.join('\n...')}\n` : ' __typename';

  const main = `
    fragment ${key} on ${fragments[key].type} {
      ${fields}
    }
  `;
  const literals = [main, ...documents.map(() => '\n')];
  return gql.apply(null, [literals, ...documents]);
}

// The fragments and configs are lazily loaded to allow circular dependencies to work.
// TODO: We might want to change this to an explicit register after we have lazy Queries and Mutations.
let initialized = false;

function init() {
  if (initialized) { return; }
  initialized = true;

  // Register fragments from framework.
  [globalFragments].forEach(map =>
    Object.keys(map).forEach(key => registerFragment(key, map[key]))
  );

  // Register configs from plugins.
  getGraphQLConfigs().forEach(cfg => registerConfig(cfg));
}

