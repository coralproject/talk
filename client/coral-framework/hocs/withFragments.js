import React from 'react';
import graphql from 'graphql-anywhere';
import {resolveFragments} from 'coral-framework/services/graphqlRegistry';
import mapValues from 'lodash/mapValues';
import hoistStatics from 'recompose/hoistStatics';
import {getShallowChanges} from 'coral-framework/utils';

// TODO: Should not depend on `props.data`
// Currently necessary because of this https://github.com/apollographql/graphql-anywhere/issues/38
function filter(doc, data, variables) {
  const resolver = (
    fieldName,
    root,
    args,
    context,
    info,
  ) => {
    return root[info.resultKey];
  };

  return graphql(resolver, doc, data, null, variables);
}

// filterProps returns only the property as defined in the fragments.
// TODO: Should not depend on `props.data`
function filterProps(props, fragments) {
  const filtered = {};
  Object.keys(fragments).forEach((key) => {
    if (!(key in props)) {
      return;
    }
    filtered[key] = filter(fragments[key], props[key], props.data.variables);
  });
  return filtered;
}

// hasEqualLeaves compares two different apollo query result for equality.
function hasEqualLeaves(a, b, path = '') {
  for (const key in a) {
    if (typeof a[key] === 'object') {
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

export default (fragments) => hoistStatics((BaseComponent) => {
  class WithFragments extends React.Component {
    fragments = mapValues(fragments, (val) => resolveFragments(val));
    fragmentKeys = Object.keys(fragments).sort();

    // Cache variables between lifecycles to speed up render.
    filteredProps = filterProps(this.props, this.fragments)
    queryDataHasChanged = false;
    lastFilteredProps = null;
    shallowChanges = null;

    componentWillReceiveProps(next) {
      this.shallowChanges = getShallowChanges(this.props, next);
      this.queryDataHasChanged = this.fragmentKeys.some((key) => this.shallowChanges.indexOf(key) >= 0);

      if (this.queryDataHasChanged) {

        // If query data has changed, we compute the next filtered props.
        this.lastFilteredProps = this.filteredProps;
        this.filteredProps = filterProps(next, this.fragments);
      }
    }

    shouldComponentUpdate(next) {

      // If only query data was changed.
      if (this.queryDataHasChanged && this.shallowChanges.every((key) => this.fragmentKeys.indexOf(key) >= 0)) {
        return !hasEqualLeaves(this.lastFilteredProps, this.filteredProps);
      }

      return this.shallowChanges.length !== 0;
    }

    render() {
      const queryProps = this.filteredProps;
      return <BaseComponent
        {...this.props}
        {...queryProps}
      />;
    }
  }

  WithFragments.fragments = fragments;
  return WithFragments;
});
