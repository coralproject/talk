import React from 'react';
import hoistStatics from 'recompose/hoistStatics';
import { Subscriber } from 'react-broadcast';
import get from 'lodash/get';

/**
 * WithRefetch provides a property `refetch` to the wrapped component.
 * Calling refetch will perform a refetch of the parent Query.
 */
export default hoistStatics(WrappedComponent => {
  class WithRefetch extends React.Component {
    render() {
      return (
        <Subscriber channel="queryData">
          {data => (
            <WrappedComponent {...this.props} refetch={get(data, 'refetch')} />
          )}
        </Subscriber>
      );
    }
  }
  return WithRefetch;
});
