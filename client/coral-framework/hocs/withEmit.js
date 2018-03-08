import React from 'react';
import hoistStatics from 'recompose/hoistStatics';
import PropTypes from 'prop-types';

/**
 * WithEmit provides a property `emit: (eventName, value)`
 * to the wrapped component.
 */
export default hoistStatics(WrappedComponent => {
  class WithEmit extends React.Component {
    static contextTypes = {
      eventEmitter: PropTypes.object,
    };

    emit = (eventName, value) => {
      this.context.eventEmitter.emit(eventName, value);
    };

    render() {
      return <WrappedComponent {...this.props} emit={this.emit} />;
    }
  }

  return WithEmit;
});
