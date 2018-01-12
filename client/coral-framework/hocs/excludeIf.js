import React from 'react';
import hoistStatics from 'recompose/hoistStatics';

/**
 * ExcludeIf provides a property `emit: (eventName, value)`
 * to the wrapped component.
 */
export default condition =>
  hoistStatics(WrappedComponent => {
    class ExcludeIf extends React.Component {
      render() {
        return <WrappedComponent {...this.props} />;
      }
    }

    WrappedComponent.isExcluded = condition;
    return ExcludeIf;
  });
