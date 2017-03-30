import React, {Component} from 'react';
import {importer as injectPlugins} from 'coral-framework/helpers/importer';

class Slot extends Component {
  render() {
    const {pluginProps: actions, ...props} = this.props;
    return (
      <div>
        {injectPlugins({...props, actions})}
      </div>
    );
  }
}

export default Slot;
