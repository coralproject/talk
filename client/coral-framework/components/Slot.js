import React, {Component} from 'react';
import {getSlotElements} from 'coral-framework/helpers/plugins';

class Slot extends Component {
  render() {
    const {fill, ...rest} = this.props;
    return (
      <div>
        {getSlotElements(fill, rest)}
      </div>
    );
  }
}

export default Slot;
