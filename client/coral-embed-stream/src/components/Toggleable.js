import React from 'react';
import ClickOutside from 'coral-framework/components/ClickOutside';
import styles from './Toggleable.css';
import cn from 'classnames';

const upArrow = <span className={cn(styles.chevron, styles.up)} />;
const downArrow = <span className={cn(styles.chevron, styles.down)} />;

export default class Toggleable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  close = () => {
    if (this.state.isOpen) {
      this.setState({ isOpen: false });
    }
  };

  render() {
    const { children, className, ...rest } = this.props;
    const { isOpen } = this.state;
    return (
      <ClickOutside onClickOutside={this.close}>
        <span {...rest} className={cn(className, styles.Toggleable)}>
          <button className={styles.toggler} onClick={this.toggle}>
            {isOpen ? upArrow : downArrow}
          </button>
          {isOpen ? children : null}
        </span>
      </ClickOutside>
    );
  }
}
