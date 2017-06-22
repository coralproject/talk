import React from 'react';
import ClickOutside from 'coral-framework/components/ClickOutside';
import styles from './Toggleable.css';
import classnames from 'classnames';

const upArrow = <span className={classnames(styles.chevron, styles.up)}></span>;
const downArrow = <span className={classnames(styles.chevron, styles.down)}></span>;

export default class Toggleable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  toggle = () => {
    this.setState({isOpen: !this.state.isOpen});
  }

  close = () => {
    this.setState({isOpen: false});
  }

  render() {
    const {children} = this.props;
    const {isOpen} = this.state;
    return (
      <ClickOutside onClickOutside={this.close}>
        <span className={styles.Toggleable} tabIndex="0" >
          <span className={styles.toggler}
                onClick={this.toggle}>{isOpen ? upArrow : downArrow}</span>
          {isOpen ? children : null}
        </span>
      </ClickOutside>
    );
  }
}

