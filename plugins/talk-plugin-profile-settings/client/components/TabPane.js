import React from 'react';
import PropTypes from 'prop-types';
import { Slot } from 'plugin-api/beta/client/components';

class TabPane extends React.Component {
  render() {
    const { data, root } = this.props;
    return (
      <div>
        <Slot fill="profileSettings" data={data} queryData={{ root }} />
      </div>
    );
  }
}

TabPane.propTypes = {
  data: PropTypes.object,
  root: PropTypes.object,
};

export default TabPane;
