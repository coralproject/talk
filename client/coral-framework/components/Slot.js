import React, {Component} from 'react';
import injectedPlugins from 'coral-framework/helpers/importer';

class Slot extends Component {
  componentDidMount() {
    console.log('Slot Mounted');
  }
  render() {
    const {fill} = this.props;
    return (
      <div>
        {injectedPlugins(fill)}
      </div>
    );
  }
}

export default Slot;
