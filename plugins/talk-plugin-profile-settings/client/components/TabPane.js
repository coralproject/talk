import React from 'react';
import PropTypes from 'prop-types';
import { Slot } from 'plugin-api/beta/client/components';

class TabPane extends React.Component {
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

TabPane.propTypes = {
  data: PropTypes.object,
  root: PropTypes.object,
};

export default TabPane;
