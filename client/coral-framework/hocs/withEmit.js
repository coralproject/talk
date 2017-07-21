import React from 'react';
const PropTypes = require('prop-types');

/**
 * WithEmit provides a property `emit: (eventName, value)`
 * to the wrapped component.
 */
export default (WrappedComponent) => {
  class WithEmit extends React.Component {
    static contextTypes = {
      eventEmitter: PropTypes.object,
    };

    emit = (eventName, value) => {
      this.context.eventEmitter.emit(eventName, value);
    };

    render() {
      return <WrappedComponent
        {...this.props}
        emit={this.emit}
      />;
    }
  }

  return WithEmit;
};
