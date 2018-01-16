import React from 'react';
import AssetStatusInfo from '../containers/AssetStatusInfo';
import Settings from '../containers/Settings';
import PropTypes from 'prop-types';

class Configure extends React.Component {
  render() {
    return (
      <div className="talk-embed-stream-configuration-container">
        <Settings
          data={this.props.data}
          root={this.props.root}
          asset={this.props.asset}
        />
        <hr />
        <AssetStatusInfo asset={this.props.asset} />
      </div>
    );
  }
}

Configure.propTypes = {
  data: PropTypes.object.isRequired,
  root: PropTypes.object.isRequired,
  asset: PropTypes.object.isRequired,
};

export default Configure;
