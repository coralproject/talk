import React from 'react';
import {getDisplayName} from 'recompose';

// TODO: revisit `filtering` after https://github.com/apollographql/graphql-anywhere/issues/38.

export default fragments => WrappedComponent => {
  class WithFragments extends React.Component {
    render() {
      return <WrappedComponent {...this.props} />;
    }
  }
  WithFragments.fragments = fragments;
  WithFragments.displayName = `WithFragments(${getDisplayName(WrappedComponent)})`;
  return WithFragments;
};
