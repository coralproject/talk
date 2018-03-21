import React from 'react';
import hoistStatics from 'recompose/hoistStatics';
import { Subscriber } from 'react-broadcast';
import get from 'lodash/get';

/**
 * WithSubscribeToMore provides a property `subscribeToMore` to the wrapped component.
 * Calling `subscribeToMore` is the same as calling `data.subscribeToMore` from the
 * Apollo React API.
 */
export default hoistStatics(WrappedComponent => {
  class WithSubscribeToMore extends React.Component {
    render() {
      return (
        <Subscriber channel="queryData">
          {data => (
            <WrappedComponent
              {...this.props}
              subscribeToMore={get(data, 'subscribeToMoreThrottled')}
            />
          )}
        </Subscriber>
      );
    }
  }
  return WithSubscribeToMore;
});
