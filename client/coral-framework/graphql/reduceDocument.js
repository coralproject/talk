import {
  getMainDefinition,
  getFragmentDefinitions,
  createFragmentMap,
  shouldInclude,
  getOperationDefinition,
} from 'apollo-utilities';

function getDefinitionName(definition) {
  switch (definition.kind) {
  case 'FragmentSpread':
    return definition.name.value;
  case 'Field':
    return `Field_${definition.alias ? definition.alias.value : definition.name.value}`;
  case 'InlineFragment':
    return `InlineFragment_${definition.typeCondition.name.value}`;
  default:
    throw new Error(`unknown definition kind ${definition.kind}`);
  }
}

/**
 * Merge selections of 2 definitions.
 */
export function mergeDefinitions(a, b) {
  const name = getDefinitionName(a);

  if (!!a.selectionSet !== !!b.selectionSet) {
    throw Error(`incompatible field definition for ${name}`);
  }

  if (!a.selectionSet) {
    return b;
  }

  const selectionSet = mergeSelectionSets(a.selectionSet, b.selectionSet);

  return {
    ...b,
    selectionSet,
  };
}

/**
 * Merge selectionSets
 */
export function mergeSelectionSets(a, b) {
  const selectionsMap = [...a.selections, ...b.selections].reduce((o, sel) => {
    const selName = getDefinitionName(sel);
    if (!(selName in o)) {
      o[selName] = sel;
      return o;
    }
    o[selName] = mergeDefinitions(o[selName], sel);
    return o;
  }, {});

  const selections = Object.keys(selectionsMap).map((key) => selectionsMap[key]);

  return {
    ...b,
    selections,
  };
}

/**
 * Return selections with resolved named fragments and directives.
 */
function getTransformedSelections(definition, path, gqlType, execContext) {
  const {
    fragmentMap,
    variables,
  } = execContext;

  const selectionsMap = definition.selectionSet.selections.reduce((o, sel) => {
    if (variables && !shouldInclude(sel, variables)) {

      // Skip this entirely
      return o;
    }
    if (sel.kind !== 'FragmentSpread') {
      const transformed = transformDefinition(sel, execContext, path, gqlType);
      const name = getDefinitionName(sel);

      // Merge existing value.
      if (name in o) {
        o[name] = mergeDefinitions(o[name], transformed);
        return o;
      }

      o[name] = transformed;
      return o;
    }

    const fragment = fragmentMap[sel.name.value];

    if (!fragment) {
      throw new Error(`fragment ${fragment.name.value} does not exist`);
    }

    const typeCondition = fragment.typeCondition.name.value;

    if (gqlType !== typeCondition) {
      const node = {
        ...fragment,
        kind: 'InlineFragment',
      };
      const transformed = transformDefinition(node, execContext, path, typeCondition);
      const name = getDefinitionName(node);

      // Merge existing value.
      if (name in o) {
        o[name] = mergeDefinitions(o[name], transformed);
        return o;
      }

      o[name] = transformed;
      return o;
    }

    const fragmentSelections = getTransformedSelections(fragment, path, typeCondition, execContext);
    fragmentSelections.forEach((s) => {

      if (variables && !shouldInclude(s, variables)) {

        // Skip this entirely
        return;
      }

      const selName = getDefinitionName(s);
      if (!(selName in o)) {
        o[selName] = s;
        return;
      }

      o[selName] = mergeDefinitions(o[selName], s);
    });
    return o;
  }, {});

  const selections = Object.keys(selectionsMap).map((key) => selectionsMap[key]);
  return selections;
}

/**
 * Resolve named fragments and directives in a definition.
 */
function transformDefinition(definition, execContext, path = '', type = null) {
  if (!definition.selectionSet) {
    return definition;
  }

  const {typeGetter} = execContext;

  if (definition.kind === 'Field') {
    const fieldName = definition.name.value;
    path = `${path}.${fieldName}`;

    if (typeGetter) {
      type = typeGetter(path);
    }
  }

  // InlineFragments
  else if(!type && typeGetter) {
    type = typeGetter(path);
  }

  return {
    ...definition,
    selectionSet: {
      ...definition.selectionSet,
      selections: getTransformedSelections(definition, path, type, execContext),
    },
  };
}

export default function reduceDocument(document, options = {}) {
  const mainDefinition = getMainDefinition(document);
  const fragments = getFragmentDefinitions(document);
  const operationDefinition = getOperationDefinition(document);
  const path = operationDefinition
    ? operationDefinition.operation
    : `type.${mainDefinition.typeCondition.name.value}`;

  const execContext = {
    fragmentMap: createFragmentMap(fragments),
    keepFragments: [],
    variables: options.variables,
    typeGetter: options.typeGetter || (() => null),
  };

  return {
    kind: 'Document',
    definitions: [transformDefinition(mainDefinition, execContext, path)],
  };
}

function getObjectType(fieldType) {
  if (['NON_NULL', 'LIST'].indexOf(fieldType.kind) > -1) {
    return getObjectType(fieldType.ofType);
  }
  return fieldType.name;
}

function getFieldType(parentType, fieldName) {
  const field = parentType.fields.find((f) => f.name === fieldName);
  return getObjectType(field.type);
}

export function createTypeGetter(introspectionData) {
  const types = {};
  introspectionData.__schema.types.forEach((type) => types[type.name] = type);

  const result = {
    'query': introspectionData.__schema.queryType.name,
    'mutation': introspectionData.__schema.mutationType.name,
    'subscription': introspectionData.__schema.subscriptionType.name,
  };

  return (path) => {
    if (result[path]) {
      return result[path];
    }
    let currentPath = '';
    const parts = path.split('.');
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      // Handle special path e.g. 'type.ROOT_QUERY.fieldName'
      if (part === 'type') {
        const type = parts[i + 1];
        const nextPath = `type.${type}`;
        result[nextPath] = type;
        currentPath = nextPath;
        i++;
        continue;
      }

      const nextPath = currentPath ? `${currentPath}.${part}` : part;
      if (nextPath in result) {
        currentPath = nextPath;
        continue;
      }
      result[nextPath] = getFieldType(types[result[currentPath]], part);
      currentPath = nextPath;
    }
    return result[path];
  };
}
