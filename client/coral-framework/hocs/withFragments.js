import React from 'react';

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
