import React from 'react';
import hoistStatics from 'recompose/hoistStatics';

/**
 * WithGraphQLExtension adds graphql configuration to the
 * GraphQL registry, only works on Components used
 * directly in a Slot.
 */
export default extension =>
  hoistStatics(WrappedComponent => {
    class WithGraphQLExtension extends React.Component {
      render() {
        return <WrappedComponent {...this.props} />;
      }
    }

    WrappedComponent.graphqlExtension = extension;
    return WithGraphQLExtension;
  });
