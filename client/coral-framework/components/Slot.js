import React, {Component} from 'react';
import {injectPlugins} from 'coral-framework/helpers/plugins';

class Slot extends Component {
  render() {
    const {pluginProps, ...props} = this.props;
    return (
      <div>
        {injectPlugins({...props, ...pluginProps})}
      </div>
    );
  }
}

export default Slot;
