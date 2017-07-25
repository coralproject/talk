import React from 'react';
const PropTypes = require('prop-types');

class EventEmitterProvider extends React.Component {
  getChildContext() {
    return {eventEmitter: this.props.eventEmitter};
  }

  render() {
    return this.props.children;
  }
}

EventEmitterProvider.childContextTypes = {
  eventEmitter: PropTypes.object,
};

export default EventEmitterProvider;
