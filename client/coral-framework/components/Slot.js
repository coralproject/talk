import React, {Component} from 'react';
import {importer as injectPlugins} from 'coral-framework/helpers/importer';
import actions from 'coral-framework/actions';

class Slot extends Component {
  render() {
    const slotProps = {...this.props, ...actions};
    return (
      <div>
        {injectPlugins(slotProps)}
      </div>
    );
  }
}

export default Slot;
