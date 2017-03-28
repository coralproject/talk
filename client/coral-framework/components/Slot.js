import React, {Component} from 'react';
import injectedPlugins from 'coral-framework/helpers/importer';

class Slot extends Component {
  componentDidMount() {
    console.log('Slot Mounted');
  }
  render() {
    return (
      <div>
        {injectedPlugins}
      </div>
    );
  }
}

export default Slot;
