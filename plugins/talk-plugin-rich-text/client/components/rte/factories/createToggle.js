import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';

const createToggle = (execCommand, getCurrentState) => {
  class Toggle extends React.Component {
    state = {
      active: false,
    };

    formatToggle = () => {
      execCommand();
      this.props.rte.contentEditable.focus();
    };

    handleClick = () => {
      this.formatToggle();
      this.syncState();
    };

    syncState = () => {
      if (this.state.active !== getCurrentState()) {
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
    rte: PropTypes.object,
    className: PropTypes.string,
    title: PropTypes.string,
    children: PropTypes.node,
  };
  return Toggle;
};

export default createToggle;
