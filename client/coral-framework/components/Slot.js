import React, {Component} from 'react';
import {injectPlugins} from 'coral-framework/helpers/plugins';

class Slot extends Component {
  render() {
    return (
      <div>
        {injectPlugins(this.props)}
      </div>
    );
  }
}

export default Slot;
