// TODO: revisit `filtering` after https://github.com/apollographql/graphql-anywhere/issues/38.

import React from 'react';
import {resolveFragments} from 'coral-framework/services/graphqlRegistry';
import mapValues from 'lodash/mapValues';
import hoistStatics from 'recompose/hoistStatics';

export default (fragments) => hoistStatics((BaseComponent) => {
  class WithFragments extends React.Component {
    fragments = mapValues(fragments, (val) => resolveFragments(val));

    render() {
      return <BaseComponent
        {...this.props}
      />;
    }
  }

  WithFragments.fragments = fragments;
  return WithFragments;
});
