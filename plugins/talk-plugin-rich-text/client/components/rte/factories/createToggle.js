import React from 'react';
import PropTypes from 'prop-types';
import Button from '../components/Button';

/**
 *  createToggle creates a button that can be active, inactive or disabled
 *  and reacts on clicks. All callbacks are bound to the API instance.
 */
const createToggle = (
  execCommand,
  { onEnter, onShortcut, isActive = () => false, isDisabled = () => false } = {}
) => {
  class Toggle extends React.Component {
    state = {
      active: false,
      disabled: false,
    };

    execCommand = () => execCommand.apply(this.props.api);
    isActive = () => isActive.apply(this.props.api);
    isDisabled = () => isDisabled.apply(this.props.api);
    onEnter = (...args) => onEnter && onEnter.apply(this.props.api, args);
    onShortcut = (...args) =>
      onShortcut && onShortcut.apply(this.props.api, args);
    unmounted = false;

    componentWillUnmount() {
      this.unmounted = true;
    }

    formatToggle = () => {
      this.execCommand();
    };

    handleClick = () => {
      this.props.api.focus();
      this.formatToggle();
      this.props.api.focus();
      setTimeout(() => !this.unmounted && this.syncState());
    };

    syncState = () => {
      if (this.state.active !== this.isActive()) {
        this.setState(state => ({
          active: !state.active,
        }));
      }
      if (this.state.disabled !== this.isDisabled()) {
        this.setState(state => ({
          disabled: !state.disabled,
        }));
      }
    };

    onSelectionChange() {
      this.syncState();
    }

    render() {
      const { className, title, children, disabled } = this.props;
      return (
        <Button
          className={className}
          title={title}
          onClick={this.handleClick}
          active={this.state.active}
          disabled={disabled || this.state.disabled}
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
    disabled: PropTypes.bool,
  };
  return Toggle;
};

export default createToggle;
