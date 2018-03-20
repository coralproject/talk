import React from 'react';
import hoistStatics from 'recompose/hoistStatics';
import { Subscriber } from 'react-broadcast';
import get from 'lodash/get';

/**
 * WithVariables provides a property `variables` to the wrapped component.
 * These are the variables of the parent Query.
 */
export default hoistStatics(WrappedComponent => {
  class WithVariables extends React.Component {
    render() {
      return (
        <Subscriber channel="queryData">
          {data => (
            <WrappedComponent
              {...this.props}
              variables={get(data, 'variables')}
            />
          )}
        </Subscriber>
      );
    }
  }
  return WithVariables;
});
