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
        />
      </div>
    );
  }
}

Configure.propTypes = {
  isClosed: PropTypes.bool,
  closedAt: PropTypes.object,
};

export default Configure;
