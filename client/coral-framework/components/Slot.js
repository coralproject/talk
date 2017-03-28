import React, {Component} from 'react';
import injectedPlugins from 'coral-framework/helpers/importer';

class Slot extends Component {
  componentDidMount() {
    console.log('Slot Mounted');
  }
  render() {
    const {slot} = this.props;
    return (
      <div>
        {injectedPlugins}
      </div>
    );
  }
}

export default Slot;
