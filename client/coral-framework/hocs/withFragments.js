import React from 'react';
import graphql from 'graphql-anywhere';
import mapValues from 'lodash/mapValues';
import hoistStatics from 'recompose/hoistStatics';
import { getShallowChanges } from 'coral-framework/utils';
import PropTypes from 'prop-types';
import union from 'lodash/union';

// TODO: Should not depend on `props.data`
// Currently necessary because of this https://github.com/apollographql/graphql-anywhere/issues/38
function filter(doc, data, variables) {
  const resolver = (fieldName, root, args, context, info) => {
    return root[info.resultKey];
  };

  return graphql(resolver, doc, data, null, variables);
}

// filterProps returns only the property as defined in the fragments.
// TODO: Should not depend on `props.data`
function filterProps(props, fragments) {
  const filtered = {};
  Object.keys(fragments).forEach(key => {
    if (!(key in props)) {
      return;
    }
    filtered[key] = props.data
      ? filter(fragments[key], props[key], props.data.variables)
      : props[key];
  });
  return filtered;
}

// hasEqualLeaves compares two different apollo query result for equality.
function hasEqualLeaves(a, b, path = '') {
  for (const key of union(Object.keys(a), Object.keys(b))) {
    if (!(key in a) || !(key in b)) {
      return false;
    }
    if (typeof a[key] === 'object' && a[key] && b[key]) {
      if (Array.isArray(a[key])) {
        if (a[key].length !== b[key].length) {
          return false;
        }
      }
      if (!hasEqualLeaves(a[key], b[key], `${path}.${key}`)) {
        return false;
      }
      continue;
    }
    if (a[key] !== b[key]) {
      return false;
    }
  }
  return true;
}

export default fragments =>
  hoistStatics(BaseComponent => {
    class WithFragments extends React.Component {
      static contextTypes = {
        graphql: PropTypes.object,
      };

      get graphqlRegistry() {
        return this.context.graphql.registry;
      }

      resolveDocument(documentOrCallback) {
        return this.context.graphql.resolveDocument(
          documentOrCallback,
          this.props,
          this.context
        );
      }

      fragments = mapValues(fragments, val => this.resolveDocument(val));
      fragmentKeys = Object.keys(fragments).sort();

      // Cache variables between lifecycles to speed up render.
      filteredProps = filterProps(this.props, this.fragments);
      queryDataHasChanged = false;
      shallowChanges = null;

      componentWillReceiveProps(next) {
        this.shallowChanges = getShallowChanges(this.props, next);

        if (
          this.fragmentKeys.some(key => this.shallowChanges.indexOf(key) >= 0)
        ) {
          const nextFilteredProps = filterProps(next, this.fragments);
          this.queryDataHasChanged = !hasEqualLeaves(
            this.filteredProps,
            nextFilteredProps
          );
          if (this.queryDataHasChanged) {
            // Only changed props when query data has changed.
            this.filteredProps = filterProps(next, this.fragments);
          }
        }
      }

      shouldComponentUpdate(next) {
        const onlyQueryDataChanges = this.shallowChanges.every(
          key => this.fragmentKeys.indexOf(key) >= 0
        );

        if (onlyQueryDataChanges) {
          return this.queryDataHasChanged;
        }

        return this.shallowChanges.length !== 0;
      }

      render() {
        const queryProps = this.filteredProps;
        return <BaseComponent {...this.props} {...queryProps} />;
      }
    }

    WithFragments.fragments = fragments;
    return WithFragments;
  });
