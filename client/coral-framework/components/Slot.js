import React, {Component} from 'react';
import {importer as injectPlugins} from 'coral-framework/helpers/importer';

class Slot extends Component {
  render() {
    const {fill} = this.props;
    return (
      <div>
        {injectPlugins(fill)}
      </div>
    );
  }
}

export default Slot;
