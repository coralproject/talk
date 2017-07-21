import React from 'react';
const PropTypes = require('prop-types');

export default (WrappedComponent) => {
  class WithCopyToClipboard extends React.Component {
    static contextTypes = {
      eventEmitter: PropTypes.object,
    };

    emit = (eventName, value, context) => {
      this.context.eventEmitter.emit(eventName, value, context);
    };

    render() {
      return <WrappedComponent
        {...this.props}
        emit={this.emit}
      />;
    }
  }

  return WithCopyToClipboard;
};
