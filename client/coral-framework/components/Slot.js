import React, {Component} from 'react';
import {getSlotElements} from 'coral-framework/helpers/plugins';
import styles from './Slot.css';

class Slot extends Component {
  render() {
    const {fill, inline = false, ...rest} = this.props;
    return (
      <div className={inline ? styles.inline : ''}>
        {getSlotElements(fill, rest)}
      </div>
    );
  }
}

Slot.propTypes = {
  fill: React.PropTypes.string
};

export default Slot;
