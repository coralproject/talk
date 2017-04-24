import React from 'react';

// TODO: revisit `filtering` after https://github.com/apollographql/graphql-anywhere/issues/38.

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

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
