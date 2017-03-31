import React, {Component} from 'react';
import {getSlotComponents} from 'coral-framework/helpers/plugins';

class Slot extends Component {
  render() {
    const {fill, ...rest} = this.props;
    return (
      <div>
        {getSlotComponents(fill, rest)}
      </div>
    );
  }
}

export default Slot;
