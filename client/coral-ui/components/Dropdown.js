import React from 'react';
import PropTypes from 'prop-types';
import styles from './Dropdown.css';
import Icon from './Icon';
import cn from 'classnames';
import ClickOutside from 'coral-framework/components/ClickOutside';

class Dropdown extends React.Component {
  toggleRef = null;
  optionsRef = [];

  state = {
    isOpen: false,
  };

  componentDidUpdate(_, prevState) {
    if (!this.state.isOpen && prevState.isOpen) {
      // Refocus on the toggle element when menu closes.
      this.toggleRef.focus();
    }
  }

  goUp = () => {
    const index = this.optionsRef.findIndex(ref => ref.hasFocus());
    if (index > 0) {
      this.optionsRef[index - 1].focus();
    }
  };

  goDown = () => {
    const index = this.optionsRef.findIndex(ref => ref.hasFocus());
    if (index < this.optionsRef.length - 1) {
      this.optionsRef[index + 1].focus();
    }
  };

  handleOptionKeyDown = (value, e) => {
    const code = e.which;

    switch (code) {
      case 13: // 13 = Return
      case 32: // 32 = Space
        e.preventDefault();
        this.setValue(value);
        break;
      case 38: // 38 = Arrow Up
        e.preventDefault();
        this.goUp();
        break;
      case 40: // 40 = Arrow Down
        e.preventDefault();
        this.goDown();
        break;
    }
  };

  handleOptionClick = value => {
    this.setValue(value);
  };

  setValue = value => {
    if (this.props.onChange) {
      this.props.onChange(value);
    }

    this.setState({
      isOpen: false,
    });
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  handleClick = () => {
    this.toggle();
  };

  handleKeyDown = e => {
    const code = e.which;

    // 13 = Return, 32 = Space
    if (code === 13 || code === 32) {
      e.preventDefault();
      this.toggle();
    }
  };

  hideMenu = () => {
    this.setState({
      isOpen: false,
    });
  };

  handleToggleRef = ref => (this.toggleRef = ref);

  handleOptionsRef = (ref, index) => {
    this.optionsRef[index] = ref;

    // Focus on current value when menu opens.
    if (ref) {
      if (
        ref.props.value === this.props.value ||
        (index === 0 && !this.props.value)
      ) {
        ref.focus();
        return;
      }
    }
  };

  // Trap keyboard focus inside the dropdown until a value has been chosen.
  trapFocusBegin = () => this.optionsRef[this.optionsRef.length - 1].focus();
  trapFocusEnd = () => this.optionsRef[0].focus();

  renderLabel() {
    const options = React.Children.toArray(this.props.children);
    const option = options.find(
      option => option.props.value === this.props.value
    );

    if (option) {
      return option.props.label ? option.props.label : option.props.value;
    } else if (this.props.value) {
      return this.props.value;
    } else {
      return this.props.placeholder;
    }
  }

  render() {
    const {
      containerClassName,
      toggleClassName,
      toggleOpenClassName,
    } = this.props;
    return (
      <ClickOutside onClickOutside={this.hideMenu}>
        <div
          className={cn(styles.dropdown, containerClassName, 'dd dd-container')}
        >
          <div
            className={cn(styles.toggle, toggleClassName, {
              [cn(this.state.isOpen, toggleOpenClassName)]: this.state.isOpen,
            })}
            onClick={this.handleClick}
            onKeyDown={this.handleKeyDown}
            role="button"
            aria-pressed={this.state.isOpen}
            aria-haspopup="true"
            tabIndex="0"
            ref={this.handleToggleRef}
          >
            {this.props.icon && (
              <Icon
                name={this.props.icon}
                className={styles.icon}
                aria-hidden="true"
              />
            )}
            <span className={styles.label}>{this.renderLabel()}</span>
            {this.state.isOpen ? (
              <Icon
                name="keyboard_arrow_up"
                className={styles.arrow}
                aria-hidden="true"
              />
            ) : (
              <Icon
                name="keyboard_arrow_down"
                className={styles.arrow}
                aria-hidden="true"
              />
            )}
          </div>
          {this.state.isOpen && (
            <div>
              <div tabIndex="0" onFocus={this.trapFocusBegin} />
              <ul
                className={cn(
                  styles.list,
                  { [styles.listActive]: this.state.isOpen },
                  'dd-list-active'
                )}
              >
                {React.Children.toArray(this.props.children).map((child, i) =>
                  React.cloneElement(child, {
                    key: child.props.value,
                    ref: ref => this.handleOptionsRef(ref, i),
                    index: i,
                    onClick: () => this.handleOptionClick(child.props.value),
                    onKeyDown: e =>
                      this.handleOptionKeyDown(child.props.value, e),
                  })
                )}
              </ul>
              <div tabIndex="0" onFocus={this.trapFocusEnd} />
            </div>
          )}
        </div>
      </ClickOutside>
    );
  }
}

Dropdown.propTypes = {
  containerClassName: PropTypes.string,
  toggleClassName: PropTypes.string,
  toggleOpenClassName: PropTypes.string,
  placeholder: PropTypes.string,
  icon: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.bool,
  ]),
};

export default Dropdown;
