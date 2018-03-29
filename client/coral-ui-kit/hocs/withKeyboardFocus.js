import React from 'react';
import hoistStatics from 'recompose/hoistStatics';
import PropTypes from 'prop-types';

/**
 * withKeyboardFocus provides a property `keyboardFocus: boolean`
 * to indicate a focus on the element, that wasn't triggered by mouse
 * or touch.
 */
export default hoistStatics(WrappedComponent => {
  class WithKeyboardFocus extends React.Component {
    state = {
      keyboardFocus: false,
      lastMouseDownTime: 0,
    };

    handleFocus = event => {
      this.props.onFocus && this.props.onFocus(event);
      let now = new Date().getTime();
      if (now - this.state.lastMouseDownTime > 750) {
        this.setState({ keyboardFocus: true });
      }
    };

    handleBlur = event => {
      this.props.onBlur && this.props.onBlur(event);
      this.setState({ keyboardFocus: false });
    };

    handleMouseDown = event => {
      this.props.onMouseDown && this.props.onMouseDown(event);
      this.setState({ lastMouseDownTime: new Date().getTime() });
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onMouseDown={this.handleMouseDown}
          keyboardFocus={this.state.keyboardFocus}
        />
      );
    }
  }

  WithKeyboardFocus.propTypes = {
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onMouseDown: PropTypes.func,
  };

  return WithKeyboardFocus;
});
