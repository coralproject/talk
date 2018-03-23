import React from 'react';
import PropTypes from 'prop-types';
import Button from '../components/Button';

const createToggle = (execCommand, getCurrentState, { onEnter } = {}) => {
  class Toggle extends React.Component {
    state = {
      active: false,
    };

    execCommand = () => execCommand.apply(this.props.api);
    getCurrentState = () => getCurrentState.apply(this.props.api);
    onEnter = (...args) => onEnter && onEnter.apply(this.props.api, args);

    formatToggle = () => {
      this.execCommand();
    };

    handleClick = () => {
      this.props.api.focus();
      this.formatToggle();
      this.props.api.focus();
    };

    syncState = () => {
      if (this.state.active !== this.getCurrentState()) {
        this.setState(state => ({
          active: !state.active,
        }));
      }
    };

    onSelectionChange() {
      this.syncState();
    }

    render() {
      const { className, title, children } = this.props;
      return (
        <Button
          className={className}
          title={title}
          onClick={this.handleClick}
          active={this.state.active}
        >
          {children}
        </Button>
      );
    }
  }

  Toggle.propTypes = {
    api: PropTypes.object,
    className: PropTypes.string,
    title: PropTypes.string,
    children: PropTypes.node,
  };
  return Toggle;
};

export default createToggle;
