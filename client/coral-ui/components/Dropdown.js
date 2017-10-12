import React from 'react';
import PropTypes from 'prop-types';
import styles from './Dropdown.css';
import Icon from './Icon';
import cn from 'classnames';
import ClickOutside from 'coral-framework/components/ClickOutside';

class Dropdown extends React.Component {

  constructor() {
    super();

    this.state = {
      isOpen: false
    };
  }
  
  setValue = (value) => {
    if (this.props.onChange) {
      this.props.onChange(value);
    }

    this.setState({
      isOpen: false
    });
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  handleClick = () => {
    this.toggle();
  }

  handleKeyDown = (e) => {
    const code = e.which;
    
    // 13 = Return, 32 = Space
    if ((code === 13) || (code === 32)) {
      e.preventDefault();
      this.toggle();
    }
  }

  hideMenu = () => {
    this.setState({
      isOpen: false
    });
  }

  renderLabel() {
    if (this.props.label) {
      return this.props.label;
    } else if (this.props.value) {
      return this.props.value;
    } else {
      return this.props.placeholder;
    }
  }

  render() {
    return (
      <ClickOutside onClickOutside={this.hideMenu}>
        <div className={styles.dropdown} onClick={this.handleClick} onKeyDown={this.handleKeyDown} role="button" aria-label="Dropdown" aria-haspopup="true" tabIndex="1">
          {this.props.icon && <Icon name={this.props.icon} className={styles.icon} />}
          <span className={styles.label}>{this.renderLabel()}</span>
          {this.state.isOpen ? <Icon name="keyboard_arrow_up" className={styles.arrow} /> : <Icon name="keyboard_arrow_down" className={styles.arrow} />}
          <ul className={cn(styles.list, {[styles.listActive] : this.state.isOpen})} role="menubar" aria-hidden="true" tabIndex="2">
            {React.Children.toArray(this.props.children)
              .map((child) =>
                React.cloneElement(child, {
                  key: child.props.value,
                  onClick: () => this.setValue(child.props.value, child.props.label)
                }))}
          </ul>
        </div>
      </ClickOutside>
    );
  }
}

Dropdown.propTypes = {
  placeholder: PropTypes.string,
  icon: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  label: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.bool
  ]),
};

export default Dropdown;
