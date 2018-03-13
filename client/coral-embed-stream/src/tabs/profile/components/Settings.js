import React from 'react';
import PropTypes from 'prop-types';
import { Slot } from 'coral-framework/components';

class Settings extends React.Component {
  render() {
    const { data, root } = this.props;
    const slotPassthrough = { data, root };
    return (
      <div>
        <Slot fill="profileSettings" passthrough={slotPassthrough} />
      </div>
    );
  }
}

Settings.propTypes = {
  data: PropTypes.object,
  root: PropTypes.object,
};

export default Settings;
