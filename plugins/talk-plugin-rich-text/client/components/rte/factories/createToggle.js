import React from 'react';
import PropTypes from 'prop-types';
import Button from '../components/Button';
import bowser from 'bowser';

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

    // Detect whether there was focus on the RTE before the click.
    hadFocusBeforeClick = false;
    handleMouseDown = () => (this.hadFocusBeforeClick = this.props.api.focused);

    handleClick = () => {
      // Skip IOS when the focus was not there before.
      // IOS fails to focus to the RTE correctly and scrolls to nirvana.
      // See https://www.pivotaltracker.com/story/show/157607216
      if (!this.hadFocusBeforeClick && bowser.ios) {
        return;
      }
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
          onMouseDown={this.handleMouseDown}
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
