import React from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import styles from './Option.css';
import cn from 'classnames';
import { BareButton } from 'coral-ui';

class Option extends React.Component {
  ref = null;

  handleRef = ref => {
    this.ref = findDOMNode(ref);
  };

  focus = () => {
    this.ref.focus();
  };
  hasFocus = () => document.activeElement === this.ref;

  render() {
    const { className, label = '', onClick, onKeyDown } = this.props;
    const id = this.props.id ? this.props.id : this.props.value;
    return (
      <li>
        <BareButton
          className={cn(styles.option, className, 'dd-option')}
          onClick={onClick}
          onKeyDown={onKeyDown}
          role="option"
          ref={this.handleRef}
          id={id}
        >
          {label}
        </BareButton>
      </li>
    );
  }
}

Option.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  onClick: PropTypes.func,
  onKeyDown: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.bool,
  ]),
};

export default Option;
