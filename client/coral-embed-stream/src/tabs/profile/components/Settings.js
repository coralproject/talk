import React from 'react';
import PropTypes from 'prop-types';
import { Slot } from 'coral-framework/components';
import DownloadCommentHistorySection from './DownloadCommentHistorySection';

class Settings extends React.Component {
  render() {
    const { root } = this.props;
    const slotPassthrough = { root };
    return (
      <div>
        <Slot fill="profileSettings" passthrough={slotPassthrough} />
        <DownloadCommentHistorySection root={root} />
      </div>
    );
  }
}

Settings.propTypes = {
  root: PropTypes.object,
};

export default Settings;
