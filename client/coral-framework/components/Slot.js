import React, {Component} from 'react';
import {importer as injectPlugins} from 'coral-framework/helpers/importer';

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
