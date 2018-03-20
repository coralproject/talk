import React from 'react';
import hoistStatics from 'recompose/hoistStatics';
import { Subscriber } from 'react-broadcast';
import get from 'lodash/get';

/**
 * WithFetchMore provides a property `fetchMore` to the wrapped component.
 * Calling `fetchMore` is the same as calling `data.fetchMore` from the
 * Apollo React API.
 */
export default hoistStatics(WrappedComponent => {
  class WithFetchMore extends React.Component {
    render() {
      return (
        <Subscriber channel="queryData">
          {data => (
            <WrappedComponent
              {...this.props}
              fetchMore={get(data, 'fetchMore')}
            />
          )}
        </Subscriber>
      );
    }
  }
  return WithFetchMore;
});
