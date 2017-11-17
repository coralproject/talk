import React from 'react';
import AssetStatusInfo from './AssetStatusInfo';
import PropTypes from 'prop-types';

class Configure extends React.Component {
  render() {
    return (
      <div className='talk-embed-stream-configuration-container'>
        <hr />
        <AssetStatusInfo
          isClosed={this.props.isClosed}
          closedAt={this.props.closedAt}
          onOpen={this.props.onOpenAsset}
          onClose={this.props.onCloseAsset}
        />
      </div>
    );
  }
}

Configure.propTypes = {
  isClosed: PropTypes.bool.isRequired,
  closedAt: PropTypes.string,
  onOpenAsset: PropTypes.func.isRequired,
  onCloseAsset: PropTypes.func.isRequired,
};

export default Configure;
