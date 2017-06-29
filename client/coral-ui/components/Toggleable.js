import React from 'react';
import styles from './Toggleable.css';
import classnames from 'classnames';

const upArrow = <span className={classnames(styles.chevron, styles.up)}></span>;
const downArrow = <span className={classnames(styles.chevron, styles.down)}></span>;
class Toggleable extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.close = this.close.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({isOpen: !this.state.isOpen});
  }
  close() {
    this.setState({isOpen: false});
  }
  render() {
    const {children} = this.props;
    const {isOpen} = this.state;
    return (

      // /*onBlur={ this.close } */
      <div className={`toggle ${styles.Toggleable}`} tabIndex="0" >
        <span className={styles.toggler}
              onClick={this.toggle}> {this.props.text} {isOpen ? upArrow : downArrow}</span>
        {isOpen ? children : null}
      </div>
    );
  }
}

export default Toggleable;
